import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSubscription } from "@/lib/subscription/serverGate";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId") || "rahul";

    const verified = await getVerifiedSubscription(creatorId);

    return NextResponse.json({
      success: true,
      creatorId: verified.creatorId,
      planId: verified.planId,
      planName: verified.plan.name,
      status: verified.status,
      billingCycle: verified.billingCycle,
      priceInr: verified.priceInr,
      currentPeriodStart: verified.currentPeriodStart,
      currentPeriodEnd: verified.currentPeriodEnd,
      cancelAtPeriodEnd: verified.cancelAtPeriodEnd,
      isExpired: verified.isExpired,
      limits: verified.plan.limits,
      usage: {
        aiUsage: verified.aiUsage,
        aiLimit: verified.aiLimit,
        aiRemaining: verified.aiRemaining,
        applicationsUsage: verified.applicationsUsage,
        applicationsLimit: verified.applicationsLimit,
        applicationsRemaining: verified.applicationsRemaining,
        usageResetAt: verified.usageResetAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error querying subscription usage";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
