import { NextRequest, NextResponse } from "next/server";
import { updateServerSubscription } from "@/lib/subscription/serverGate";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { PlanId } from "@/types/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, planId } = body as {
      creatorId: string;
      planId: PlanId;
    };

    if (!creatorId || !planId) {
      return NextResponse.json(
        { success: false, error: "Missing creatorId or planId." },
        { status: 400 }
      );
    }

    if (planId !== "pro" && planId !== "pro_plus") {
      return NextResponse.json(
        { success: false, error: "Trial is only available for Pro or Pro+ plans." },
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
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day trial

    const updated = await updateServerSubscription({
      creatorId,
      planId,
      status: "trialing",
      billingCycle: "monthly",
      priceInr: plan.priceMonthlyInr,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: trialEnd.toISOString(),
      cancelAtPeriodEnd: false,
      resetQuotas: true,
    });

    return NextResponse.json({
      success: true,
      message: `7-Day Free Trial activated for ${plan.name}`,
      creatorId: updated.creatorId,
      planId: updated.planId,
      planName: updated.plan.name,
      status: updated.status,
      currentPeriodStart: updated.currentPeriodStart,
      currentPeriodEnd: updated.currentPeriodEnd,
      limits: updated.plan.limits,
      usageResetAt: updated.usageResetAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error activating trial";
    console.error("Trial activation error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
