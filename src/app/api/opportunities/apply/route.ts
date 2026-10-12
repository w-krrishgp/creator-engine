import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAndConsumeApplicationQuota } from "@/lib/subscription/serverGate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId, creatorId, fee, notes } = body;

    if (!opportunityId || !creatorId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: opportunityId and creatorId." },
        { status: 400 }
      );
    }

    // SERVER-SIDE QUOTA GATEKEEPER
    // Verifies whether creator has available monthly campaign applications
    const quotaCheck = await verifyAndConsumeApplicationQuota(creatorId);
    if (!quotaCheck.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: "QUOTA_EXCEEDED",
          message: quotaCheck.reason,
          planId: quotaCheck.verifiedSub.planId,
          planName: quotaCheck.verifiedSub.plan.name,
          applicationsUsage: quotaCheck.verifiedSub.applicationsUsage,
          applicationsLimit: quotaCheck.verifiedSub.applicationsLimit,
          usageResetAt: quotaCheck.verifiedSub.usageResetAt,
          upgradeRequired: quotaCheck.verifiedSub.planId === "normal" ? "pro" : "pro_plus",
        },
        { status: 403 }
      );
    }

    const applicationRef = `CE-APP-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isServerSupabaseConfigured()) {
      const client = getServerSupabaseClient();
      if (client) {
        await client.from("opportunity_applications").upsert(
          {
            application_reference: applicationRef,
            opportunity_id: opportunityId,
            creator_id: creatorId,
            status: "Applied",
            applied_date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            applied_fee: fee || null,
            applied_notes: notes || null,
          },
          { onConflict: "application_reference" }
        );
      }
    }

    return NextResponse.json({
      success: true,
      applicationReference: applicationRef,
      opportunityId,
      creatorId,
      usage: {
        applicationsUsage: quotaCheck.verifiedSub.applicationsUsage,
        applicationsLimit: quotaCheck.verifiedSub.applicationsLimit,
        applicationsRemaining: quotaCheck.verifiedSub.applicationsRemaining,
        usageResetAt: quotaCheck.verifiedSub.usageResetAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing application submission";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
