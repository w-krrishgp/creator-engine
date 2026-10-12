import { NextRequest, NextResponse } from "next/server";
import {
  verifyPaymentSignature,
  fetchAuthoritativeSubscription,
  fetchAuthoritativePayment,
  getRazorpayConfigStatus,
} from "@/lib/razorpay/server";
import { updateServerSubscription } from "@/lib/subscription/serverGate";
import { PlanId } from "@/types/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      creatorId,
      planId,
    } = body as {
      razorpay_payment_id: string;
      razorpay_subscription_id: string;
      razorpay_signature: string;
      creatorId: string;
      planId: PlanId;
    };

    if (
      !razorpay_payment_id ||
      !razorpay_subscription_id ||
      !razorpay_signature ||
      !creatorId ||
      !planId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    const config = getRazorpayConfigStatus();
    if (!config.isConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: "RAZORPAY_NOT_CONFIGURED",
          message: "Razorpay credentials are not configured on the server.",
        },
        { status: 500 }
      );
    }

    // 1. Strict Security: Cryptographic HMAC-SHA256 signature verification
    const isSignatureValid = verifyPaymentSignature({
      paymentId: razorpay_payment_id,
      subscriptionId: razorpay_subscription_id,
      signature: razorpay_signature,
    });

    if (!isSignatureValid) {
      console.warn(`[Security Alert] Invalid payment signature for creator: ${creatorId}`);
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_SIGNATURE",
          message: "Payment authentication signature verification failed.",
        },
        { status: 400 }
      );
    }

    // 2. Strict Security: Authoritative Provider Verification
    // Do NOT trust frontend callbacks alone. Fetch live state from Razorpay API.
    let providerSub: any;
    try {
      providerSub = await fetchAuthoritativeSubscription(razorpay_subscription_id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        {
          success: false,
          error: "PROVIDER_LOOKUP_FAILED",
          message: `Unable to verify subscription status with Razorpay: ${msg}`,
        },
        { status: 400 }
      );
    }

    const validStatuses = ["active", "authenticated"];
    if (!validStatuses.includes(providerSub.status)) {
      return NextResponse.json(
        {
          success: false,
          error: "SUBSCRIPTION_NOT_ACTIVE",
          message: `Provider reported subscription status as '${providerSub.status}', expected 'active' or 'authenticated'.`,
        },
        { status: 400 }
      );
    }

    // Verify payment status with provider
    try {
      const providerPayment = await fetchAuthoritativePayment(razorpay_payment_id);
      if (providerPayment.status !== "captured" && providerPayment.status !== "authorized") {
        return NextResponse.json(
          {
            success: false,
            error: "PAYMENT_NOT_CAPTURED",
            message: `Provider reported payment status as '${providerPayment.status}'.`,
          },
          { status: 400 }
        );
      }
    } catch (err) {
      console.warn("Could not query payment record from Razorpay API:", err);
    }

    // 3. Authoritative Activation in Database
    const startIso = providerSub.current_start
      ? new Date(providerSub.current_start * 1000).toISOString()
      : new Date().toISOString();
    const endIso = providerSub.current_end
      ? new Date(providerSub.current_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const updated = await updateServerSubscription({
      creatorId,
      planId,
      status: "active",
      currentPeriodStart: startIso,
      currentPeriodEnd: endIso,
      cancelAtPeriodEnd: false,
      razorpaySubscriptionId: razorpay_subscription_id,
      razorpayPlanId: providerSub.plan_id,
      lastPaymentId: razorpay_payment_id,
      lastPaymentStatus: "captured",
      resetQuotas: true,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      creatorId: updated.creatorId,
      planId: updated.planId,
      planName: updated.plan.name,
      status: updated.status,
      currentPeriodEnd: updated.currentPeriodEnd,
      usageResetAt: updated.usageResetAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error verifying subscription payment";
    console.error("Subscription verify error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
