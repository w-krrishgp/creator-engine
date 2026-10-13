import { NextRequest, NextResponse } from "next/server";
import { updateServerSubscription } from "@/lib/subscription/serverGate";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { PlanId } from "@/types/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, planId, transactionRef } = body as {
      creatorId: string;
      planId: PlanId;
      transactionRef?: string;
    };

    if (!creatorId || !planId) {
      return NextResponse.json(
        { success: false, error: "Missing creatorId or planId." },
        { status: 400 }
      );
    }

    if (planId !== "pro" && planId !== "pro_plus") {
      return NextResponse.json(
        { success: false, error: "Only Pro and Pro+ plans require payment." },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { success: false, error: `Invalid plan specified: ${planId}` },
        { status: 400 }
      );
    }

    const now = new Date();
    const cycleEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30-day billing cycle
    const txnId = transactionRef || `upi_txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const updated = await updateServerSubscription({
      creatorId,
      planId,
      status: "active",
      billingCycle: "monthly",
      priceInr: plan.priceMonthlyInr,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: cycleEnd.toISOString(),
      cancelAtPeriodEnd: false,
      lastPaymentId: txnId,
      lastPaymentStatus: "captured",
      resetQuotas: true,
    });

    return NextResponse.json({
      success: true,
      message: `UPI Payment confirmed! Subscription upgraded to ${plan.name}`,
      creatorId: updated.creatorId,
      planId: updated.planId,
      planName: updated.plan.name,
      status: updated.status,
      currentPeriodStart: updated.currentPeriodStart,
      currentPeriodEnd: updated.currentPeriodEnd,
      paymentId: txnId,
      limits: updated.plan.limits,
      usageResetAt: updated.usageResetAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error confirming UPI payment";
    console.error("UPI confirmation error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
