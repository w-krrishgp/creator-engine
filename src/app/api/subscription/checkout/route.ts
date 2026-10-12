import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayConfigStatus,
  createProviderSubscription,
} from "@/lib/razorpay/server";
import { PlanId } from "@/types/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, creatorId, creatorName, creatorEmail } = body as {
      planId: PlanId;
      creatorId: string;
      creatorName: string;
      creatorEmail?: string;
    };

    if (!planId || !creatorId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: planId and creatorId." },
        { status: 400 }
      );
    }

    if (planId === "normal") {
      return NextResponse.json(
        { success: false, error: "Normal plan is free and does not require checkout." },
        { status: 400 }
      );
    }

    const configStatus = getRazorpayConfigStatus();

    // Strict Security Rule: Never simulate a real payment or silently activate a paid subscription
    // If credentials are missing, return safe unconfigured diagnostic status
    if (!configStatus.isConfigured) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "RAZORPAY_NOT_CONFIGURED",
          message:
            "Razorpay credentials are not configured in .env.local. Please provide RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and RAZORPAY_WEBHOOK_SECRET to enable recurring subscription checkout.",
          missing: configStatus.missing,
        },
        { status: 400 }
      );
    }

    // Server-side creation of Razorpay Subscription
    const checkoutData = await createProviderSubscription({
      planId,
      creatorId,
      creatorName: creatorName || creatorId,
      creatorEmail,
    });

    return NextResponse.json({
      success: true,
      configured: true,
      subscriptionId: checkoutData.subscriptionId,
      keyId: checkoutData.keyId,
      planId: checkoutData.planId,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error initializing subscription checkout";
    console.error("Subscription checkout error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
