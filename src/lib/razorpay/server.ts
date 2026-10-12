import Razorpay from "razorpay";
import crypto from "node:crypto";
import { PlanId } from "@/types/subscription";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

/**
 * Diagnostic check for Razorpay environment credentials.
 * Secret keys are strictly maintained on the server.
 */
export function getRazorpayConfigStatus(): {
  isConfigured: boolean;
  keyIdPresent: boolean;
  secretPresent: boolean;
  webhookSecretPresent: boolean;
  missing: string[];
} {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const missing: string[] = [];
  if (!keyId || keyId.trim() === "" || keyId.includes("placeholder")) {
    missing.push("RAZORPAY_KEY_ID (or NEXT_PUBLIC_RAZORPAY_KEY_ID)");
  }
  if (!secret || secret.trim() === "" || secret.includes("placeholder")) {
    missing.push("RAZORPAY_KEY_SECRET");
  }
  if (!webhookSecret || webhookSecret.trim() === "" || webhookSecret.includes("placeholder")) {
    missing.push("RAZORPAY_WEBHOOK_SECRET");
  }

  return {
    isConfigured: missing.length === 0,
    keyIdPresent: !!keyId && !keyId.includes("placeholder"),
    secretPresent: !!secret && !secret.includes("placeholder"),
    webhookSecretPresent: !!webhookSecret && !webhookSecret.includes("placeholder"),
    missing,
  };
}

/**
 * Returns an authenticated Razorpay instance on the server.
 * Throws a typed descriptive error if credentials are not configured.
 */
export function getRazorpayClient(): Razorpay {
  const status = getRazorpayConfigStatus();
  if (!status.keyIdPresent || !status.secretPresent) {
    throw new Error(
      `Razorpay server client cannot be initialized. Missing required credentials: ${status.missing.join(", ")}`
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Resolves the Razorpay Plan ID for a given tier.
 */
export function getRazorpayPlanIdForTier(planId: PlanId): string | null {
  if (planId === "pro") {
    return process.env.RAZORPAY_PLAN_ID_PRO || null;
  }
  if (planId === "pro_plus") {
    return process.env.RAZORPAY_PLAN_ID_PRO_PLUS || null;
  }
  return null;
}

/**
 * Server-side creation of a recurring subscription in Razorpay.
 */
export async function createProviderSubscription(params: {
  planId: PlanId;
  creatorId: string;
  creatorName: string;
  creatorEmail?: string;
}): Promise<{
  subscriptionId: string;
  keyId: string;
  planId: PlanId;
  amount: number;
  currency: string;
}> {
  const { planId, creatorId, creatorName, creatorEmail } = params;

  if (planId === "normal") {
    throw new Error("Normal plan is free and does not require a payment subscription.");
  }

  const client = getRazorpayClient();
  const targetPlan = SUBSCRIPTION_PLANS[planId];
  if (!targetPlan) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }

  let rzpPlanId = getRazorpayPlanIdForTier(planId);

  // If explicit Plan ID is not provided in env, dynamically provision or look up a monthly Plan in Razorpay
  if (!rzpPlanId) {
    try {
      const createdPlan = await client.plans.create({
        period: "monthly",
        interval: 1,
        item: {
          name: `Creator Engine ${targetPlan.name} Membership`,
          amount: targetPlan.priceMonthlyInr * 100, // paise
          currency: "INR",
          description: targetPlan.tagline,
        },
        notes: {
          platform: "Creator Engine",
          tier: planId,
        },
      });
      rzpPlanId = createdPlan.id;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to initialize Razorpay billing plan for ${targetPlan.name}: ${msg}`);
    }
  }

  // Create Razorpay Subscription
  const subscription = await client.subscriptions.create({
    plan_id: rzpPlanId,
    total_count: 120, // 10 years monthly max
    quantity: 1,
    customer_notify: 1,
    notes: {
      creatorId,
      creatorName,
      creatorEmail: creatorEmail || `${creatorId}@creatorengine.app`,
      planId,
    },
  });

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID!;

  return {
    subscriptionId: subscription.id,
    keyId,
    planId,
    amount: targetPlan.priceMonthlyInr * 100,
    currency: "INR",
  };
}

/**
 * Strict Security: Cryptographically verifies the Razorpay payment signature
 * using HMAC-SHA256 and constant-time string comparison.
 */
export function verifyPaymentSignature(params: {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const data = `${params.paymentId}|${params.subscriptionId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  try {
    const signatureBuffer = Buffer.from(params.signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Strict Security: Cryptographically verifies the incoming Razorpay webhook signature.
 */
export function verifyWebhookSignature(params: {
  rawBody: string;
  signature: string;
}): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !params.signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(params.rawBody)
    .digest("hex");

  try {
    const signatureBuffer = Buffer.from(params.signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Authoritative Provider Fetch: Retrieves live subscription status directly from Razorpay API.
 */
export async function fetchAuthoritativeSubscription(subscriptionId: string) {
  const client = getRazorpayClient();
  return client.subscriptions.fetch(subscriptionId);
}

/**
 * Authoritative Provider Fetch: Retrieves live payment record from Razorpay API.
 */
export async function fetchAuthoritativePayment(paymentId: string) {
  const client = getRazorpayClient();
  return client.payments.fetch(paymentId);
}

/**
 * Cancels a subscription in Razorpay.
 */
export async function cancelProviderSubscription(subscriptionId: string, cancelAtCycleEnd: boolean = true) {
  const client = getRazorpayClient();
  return client.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
}
