import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay/server";
import {
  updateServerSubscription,
  isWebhookEventProcessed,
  recordWebhookEvent,
} from "@/lib/subscription/serverGate";
import { PlanId } from "@/types/subscription";
import { getServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    // 1. Read raw body text for cryptographic verification
    const rawBody = await req.text();

    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      console.warn("[Security Alert] Invalid Razorpay webhook signature received.");
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;
    const eventId: string =
      req.headers.get("x-razorpay-event-id") ||
      event.event_id ||
      `${eventType}_${event.created_at}_${event?.payload?.subscription?.entity?.id || event?.payload?.payment?.entity?.id || "evt"}`;

    // 2. Strict Security: Idempotency Check
    // Prevents replay attacks and duplicate quota allocations from webhook retries
    const alreadyProcessed = await isWebhookEventProcessed(eventId);
    if (alreadyProcessed) {
      return NextResponse.json({
        status: "ok",
        message: "Event already processed (Idempotent response)",
        idempotent: true,
      });
    }

    // Extract subscription & payment entities safely
    const subEntity = event?.payload?.subscription?.entity;
    const paymentEntity = event?.payload?.payment?.entity;

    const subId: string | null = subEntity?.id || paymentEntity?.subscription_id || null;
    let creatorId: string | null = subEntity?.notes?.creatorId || paymentEntity?.notes?.creatorId || null;
    const planId: PlanId = (subEntity?.notes?.planId as PlanId) || "pro";

    // If creatorId not in notes, resolve creator from database by razorpay_subscription_id
    if (!creatorId && subId && isServerSupabaseConfigured()) {
      const client = getServerSupabaseClient();
      if (client) {
        try {
          const { data } = await client
            .from("creator_subscriptions")
            .select("creator_id")
            .eq("razorpay_subscription_id", subId)
            .single();

          if (data?.creator_id) {
            creatorId = data.creator_id;
          }
        } catch {}
      }
    }

    // 3. Handle Subscription & Payment Lifecycle Events
    if (creatorId) {
      const now = new Date();
      const currentStartIso = subEntity?.current_start
        ? new Date(subEntity.current_start * 1000).toISOString()
        : now.toISOString();
      const currentEndIso = subEntity?.current_end
        ? new Date(subEntity.current_end * 1000).toISOString()
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      switch (eventType) {
        // Initial Mandate / Activation
        case "subscription.authenticated":
        case "subscription.activated": {
          await updateServerSubscription({
            creatorId,
            planId,
            status: "active",
            currentPeriodStart: currentStartIso,
            currentPeriodEnd: currentEndIso,
            cancelAtPeriodEnd: false,
            razorpaySubscriptionId: subId,
            razorpayPlanId: subEntity?.plan_id,
            lastPaymentId: paymentEntity?.id || null,
            lastPaymentStatus: "captured",
            resetQuotas: true,
          });
          break;
        }

        // Monthly Renewal Charge
        case "subscription.charged": {
          await updateServerSubscription({
            creatorId,
            planId,
            status: "active",
            currentPeriodStart: currentStartIso,
            currentPeriodEnd: currentEndIso,
            cancelAtPeriodEnd: false,
            razorpaySubscriptionId: subId,
            lastPaymentId: paymentEntity?.id || null,
            lastPaymentStatus: "captured",
            resetQuotas: true, // Allocates fresh monthly quotas for renewed cycle
          });
          break;
        }

        // Payment Retry / Pending State
        case "subscription.pending": {
          await updateServerSubscription({
            creatorId,
            planId,
            status: "past_due",
            razorpaySubscriptionId: subId,
            lastPaymentStatus: "pending",
          });
          break;
        }

        // Retries exhausted / Failed recurring charge
        case "subscription.halted": {
          await updateServerSubscription({
            creatorId,
            planId: "normal", // Downgrade to normal upon complete payment failure
            status: "past_due",
            razorpaySubscriptionId: subId,
            lastPaymentStatus: "failed",
            paymentFailedAt: now.toISOString(),
          });
          break;
        }

        // Subscription Cancelled
        case "subscription.cancelled": {
          await updateServerSubscription({
            creatorId,
            planId: "normal",
            status: "canceled",
            cancelAtPeriodEnd: true,
            razorpaySubscriptionId: subId,
          });
          break;
        }

        // Subscription Paused
        case "subscription.paused": {
          await updateServerSubscription({
            creatorId,
            planId,
            status: "incomplete",
            razorpaySubscriptionId: subId,
          });
          break;
        }

        // Subscription Resumed
        case "subscription.resumed": {
          await updateServerSubscription({
            creatorId,
            planId,
            status: "active",
            razorpaySubscriptionId: subId,
          });
          break;
        }

        // Individual Payment Failure
        case "payment.failed": {
          await updateServerSubscription({
            creatorId,
            planId,
            status: "past_due",
            lastPaymentId: paymentEntity?.id || null,
            lastPaymentStatus: "failed",
            paymentFailedAt: now.toISOString(),
          });
          break;
        }

        default:
          break;
      }
    }

    // 4. Record event for idempotency and audit logs
    await recordWebhookEvent({
      eventId,
      eventType,
      creatorId,
      subscriptionId: subId,
      payload: event,
      status: "processed",
    });

    return NextResponse.json({ status: "ok", processed: true, eventId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error handling Razorpay webhook";
    console.error("Razorpay webhook handler error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
