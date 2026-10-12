import { NextRequest, NextResponse } from "next/server";
import {
  getVerifiedSubscription,
  updateServerSubscription,
  getInMemorySubscriptionOverride,
} from "@/lib/subscription/serverGate";
import { cancelProviderSubscription, getRazorpayConfigStatus } from "@/lib/razorpay/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, cancelAtCycleEnd = true } = body as {
      creatorId: string;
      cancelAtCycleEnd?: boolean;
    };

    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: creatorId." },
        { status: 400 }
      );
    }

    const currentSub = await getVerifiedSubscription(creatorId);
    const subOverride = getInMemorySubscriptionOverride(creatorId);

    const targetPlanId =
      subOverride?.planId ||
      currentSub.planId;

    const hasPaidPlan =
      targetPlanId !== "normal" ||
      currentSub.priceInr > 0 ||
      currentSub.status === "past_due" ||
      Boolean(subOverride?.razorpaySubscriptionId);

    if (!hasPaidPlan && currentSub.planId === "normal") {
      return NextResponse.json(
        { success: false, error: "Normal free plan cannot be cancelled." },
        { status: 400 }
      );
    }

    // If Razorpay subscription exists and server is configured, cancel with provider
    const config = getRazorpayConfigStatus();
    const rzpSubId = subOverride?.razorpaySubscriptionId || (currentSub as any).razorpaySubscriptionId;

    if (config.isConfigured && rzpSubId) {
      try {
        await cancelProviderSubscription(rzpSubId, cancelAtCycleEnd);
      } catch (err) {
        console.warn("Could not cancel subscription with Razorpay provider:", err);
      }
    }

    // Update server state
    const updated = await updateServerSubscription({
      creatorId,
      planId: cancelAtCycleEnd ? targetPlanId : "normal",
      status: "canceled",
      cancelAtPeriodEnd: cancelAtCycleEnd,
      currentPeriodEnd: currentSub.currentPeriodEnd,
    });

    return NextResponse.json({
      success: true,
      creatorId,
      planId: updated.planId,
      status: updated.status,
      cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
      currentPeriodEnd: updated.currentPeriodEnd,
      message: cancelAtCycleEnd
        ? `Your subscription has been scheduled to cancel at the end of the billing period (${new Date(updated.currentPeriodEnd).toLocaleDateString()}). You will retain Pro features until then.`
        : "Your subscription has been cancelled immediately.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error cancelling subscription";
    console.error("Subscription cancellation error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
