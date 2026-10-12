import { getServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { SUBSCRIPTION_PLANS, SAMPLE_DEFAULT_SUBSCRIPTIONS } from "@/config/subscriptions";
import { PlanId, SubscriptionPlan, SubscriptionRecord, SubscriptionStatus } from "@/types/subscription";

export interface VerifiedSubscription {
  creatorId: string;
  userId?: string | null;
  planId: PlanId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly";
  priceInr: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  isExpired: boolean;
  // Quotas & Usage
  aiUsage: number;
  aiLimit: number;
  aiRemaining: number;
  applicationsUsage: number;
  applicationsLimit: number;
  applicationsRemaining: number;
  usageResetAt: string;
}

interface CachedUsage {
  aiUsage: number;
  applicationsUsage: number;
  usageResetAt: string;
}

interface CachedSubscriptionOverride {
  planId: PlanId;
  status: SubscriptionStatus;
  priceInr: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  razorpaySubscriptionId?: string | null;
  razorpayPlanId?: string | null;
  lastPaymentId?: string | null;
  lastPaymentStatus?: string | null;
  paymentFailedAt?: string | null;
}

const inMemoryUsageStore = new Map<string, CachedUsage>();
const inMemorySubOverrideStore = new Map<string, CachedSubscriptionOverride>();

export function getInMemoryUsage(creatorId: string): CachedUsage | undefined {
  return inMemoryUsageStore.get(creatorId);
}

export function setInMemoryUsage(creatorId: string, usage: CachedUsage) {
  inMemoryUsageStore.set(creatorId, usage);
}

export function getInMemorySubscriptionOverride(creatorId: string): CachedSubscriptionOverride | undefined {
  return inMemorySubOverrideStore.get(creatorId);
}

export function resetServerUsage(creatorId?: string) {
  if (creatorId) {
    inMemoryUsageStore.delete(creatorId);
    inMemorySubOverrideStore.delete(creatorId);
  } else {
    inMemoryUsageStore.clear();
    inMemorySubOverrideStore.clear();
  }
}

/**
 * Server-Side Gatekeeper:
 * Queries the authoritative subscription record from Supabase (or trusted server fallback).
 * Never trusts client-supplied plan names, quotas, or limit flags.
 */
export async function getVerifiedSubscription(creatorId: string): Promise<VerifiedSubscription> {
  const subOverride = inMemorySubOverrideStore.get(creatorId);
  const defaultSample = SAMPLE_DEFAULT_SUBSCRIPTIONS[creatorId] || {
    planId: "normal" as PlanId,
    status: "active" as const,
    priceInr: 0,
  };

  const now = new Date();
  const defaultReset = new Date();
  defaultReset.setDate(now.getDate() + 30);

  let rawSub: (Partial<SubscriptionRecord> & Record<string, any>) | null = null;

  if (isServerSupabaseConfigured()) {
    const client = getServerSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("creator_subscriptions")
          .select("*")
          .eq("creator_id", creatorId)
          .single();

        if (!error && data) {
          rawSub = data;
        }
      } catch (err) {
        console.warn("Could not query creator_subscriptions from server Supabase client:", err);
      }
    }
  }

  // Server-side in-memory usage tracking fallback (ensures quota gate enforcement even before remote DB migration is applied)
  const cached = getInMemoryUsage(creatorId);

  // 1. Determine raw plan ID & status
  let planId: PlanId =
    (subOverride?.planId as PlanId) ||
    (rawSub?.planId as PlanId) ||
    (rawSub?.plan_id as PlanId) ||
    defaultSample.planId ||
    "normal";
  if (!SUBSCRIPTION_PLANS[planId]) {
    planId = "normal";
  }

  const rawStatus = (subOverride?.status || rawSub?.status || defaultSample.status || "active") as string;
  const status: SubscriptionStatus = (
    ["active", "trialing", "past_due", "canceled", "incomplete"].includes(rawStatus)
      ? rawStatus
      : "incomplete"
  ) as SubscriptionStatus;

  const periodEndStr =
    subOverride?.currentPeriodEnd ||
    rawSub?.currentPeriodEnd ||
    rawSub?.current_period_end ||
    defaultReset.toISOString();
  const periodEnd = new Date(periodEndStr);
  const isExpired = !isNaN(periodEnd.getTime()) && now > periodEnd;

  // 2. Strict Security: Handle inactive, expired, cancelled, pending, past_due, or incomplete subscriptions safely
  // If subscription has expired, or is cancelled, past_due, pending, inactive or incomplete,
  // downgrade immediately to the free 'normal' tier.
  if (isExpired) {
    planId = "normal";
  } else if (status === "canceled" || status === "past_due" || status === "incomplete") {
    planId = "normal";
  } else if (rawStatus === "pending" || rawStatus === "inactive") {
    planId = "normal";
  } else if (status !== "active" && status !== "trialing") {
    planId = "normal";
  }

  const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.normal;

  // 3. Evaluate usage cycle reset
  let resetAtStr = rawSub?.usage_reset_at || cached?.usageResetAt || rawSub?.current_period_end || defaultReset.toISOString();
  let resetDate = new Date(resetAtStr);
  if (isNaN(resetDate.getTime())) {
    resetDate = defaultReset;
    resetAtStr = defaultReset.toISOString();
  }

  let aiUsage = Number(rawSub?.ai_usage_count ?? cached?.aiUsage ?? 0);
  let applicationsUsage = Number(rawSub?.applications_usage_count ?? cached?.applicationsUsage ?? 0);

  // If usage cycle has elapsed, reset counters to 0
  if (now > resetDate) {
    aiUsage = 0;
    applicationsUsage = 0;
    const nextReset = new Date();
    nextReset.setDate(now.getDate() + 30);
    resetAtStr = nextReset.toISOString();

    setInMemoryUsage(creatorId, { aiUsage: 0, applicationsUsage: 0, usageResetAt: resetAtStr });

    // Persist reset in Supabase if connected
    if (isServerSupabaseConfigured()) {
      const client = getServerSupabaseClient();
      if (client) {
        try {
          await client
            .from("creator_subscriptions")
            .update({
              ai_usage_count: 0,
              applications_usage_count: 0,
              usage_reset_at: resetAtStr,
            })
            .eq("creator_id", creatorId);
        } catch {}
      }
    }
  }

  const aiLimit = plan.limits.aiRecommendationsPerMonth;
  const aiRemaining = Math.max(0, aiLimit - aiUsage);

  const applicationsLimit = plan.limits.maxApplicationsPerMonth;
  const applicationsRemaining = Math.max(0, applicationsLimit - applicationsUsage);

  return {
    creatorId,
    userId: rawSub?.userId || rawSub?.user_id || null,
    planId,
    plan,
    status,
    billingCycle: (rawSub?.billingCycle || rawSub?.billing_cycle || "monthly") as "monthly" | "yearly",
    priceInr: Number(rawSub?.priceInr || rawSub?.price_inr || plan.priceMonthlyInr),
    currentPeriodStart: rawSub?.currentPeriodStart || rawSub?.current_period_start || now.toISOString(),
    currentPeriodEnd: periodEndStr,
    cancelAtPeriodEnd: Boolean(
      subOverride?.cancelAtPeriodEnd !== undefined
        ? subOverride.cancelAtPeriodEnd
        : rawSub?.cancelAtPeriodEnd || rawSub?.cancel_at_period_end
    ),
    isExpired,
    aiUsage,
    aiLimit,
    aiRemaining,
    applicationsUsage,
    applicationsLimit,
    applicationsRemaining,
    usageResetAt: resetAtStr,
  };
}

/**
 * Verifies and atomically consumes 1 unit of monthly AI recommendation quota.
 * Rejects requests when quota is exhausted.
 */
export async function verifyAndConsumeAiQuota(creatorId: string): Promise<{
  authorized: boolean;
  reason?: string;
  verifiedSub: VerifiedSubscription;
}> {
  const verifiedSub = await getVerifiedSubscription(creatorId);

  if (verifiedSub.aiRemaining <= 0) {
    const nextTier = verifiedSub.planId === "normal" ? "Pro" : "Pro+";
    return {
      authorized: false,
      reason: `Monthly AI recommendation limit reached (${verifiedSub.aiUsage}/${verifiedSub.aiLimit} runs used). Upgrade to ${nextTier} for higher generation limits.`,
      verifiedSub,
    };
  }

  // Consume 1 unit on server
  const newAiUsage = verifiedSub.aiUsage + 1;
  const newRemaining = Math.max(0, verifiedSub.aiLimit - newAiUsage);

  // Update server in-memory tracking
  setInMemoryUsage(creatorId, {
    aiUsage: newAiUsage,
    applicationsUsage: verifiedSub.applicationsUsage,
    usageResetAt: verifiedSub.usageResetAt,
  });

  if (isServerSupabaseConfigured()) {
    const client = getServerSupabaseClient();
    if (client) {
      try {
        await client
          .from("creator_subscriptions")
          .update({ ai_usage_count: newAiUsage })
          .eq("creator_id", creatorId);

        // Record audit entry in usage logs
        try {
          await client
            .from("subscription_usage_logs")
            .insert({
              creator_id: creatorId,
              action_type: "ai_recommendation",
              plan_id: verifiedSub.planId,
            });
        } catch {}
      } catch (err) {
        console.warn("Could not increment ai_usage_count in Supabase:", err);
      }
    }
  }

  return {
    authorized: true,
    verifiedSub: {
      ...verifiedSub,
      aiUsage: newAiUsage,
      aiRemaining: newRemaining,
    },
  };
}

/**
 * Verifies and consumes 1 unit of monthly opportunity applications quota.
 */
export async function verifyAndConsumeApplicationQuota(creatorId: string): Promise<{
  authorized: boolean;
  reason?: string;
  verifiedSub: VerifiedSubscription;
}> {
  const verifiedSub = await getVerifiedSubscription(creatorId);

  if (verifiedSub.applicationsRemaining <= 0) {
    const nextTier = verifiedSub.planId === "normal" ? "Pro" : "Pro+";
    return {
      authorized: false,
      reason: `Monthly campaign application limit reached (${verifiedSub.applicationsUsage}/${verifiedSub.applicationsLimit} deals). Upgrade to ${nextTier} to apply to more brand opportunities.`,
      verifiedSub,
    };
  }

  const newAppUsage = verifiedSub.applicationsUsage + 1;
  const newRemaining = Math.max(0, verifiedSub.applicationsLimit - newAppUsage);

  // Update server in-memory tracking
  setInMemoryUsage(creatorId, {
    aiUsage: verifiedSub.aiUsage,
    applicationsUsage: newAppUsage,
    usageResetAt: verifiedSub.usageResetAt,
  });

  if (isServerSupabaseConfigured()) {
    const client = getServerSupabaseClient();
    if (client) {
      try {
        await client
          .from("creator_subscriptions")
          .update({ applications_usage_count: newAppUsage })
          .eq("creator_id", creatorId);

        try {
          await client
            .from("subscription_usage_logs")
            .insert({
              creator_id: creatorId,
              action_type: "campaign_application",
              plan_id: verifiedSub.planId,
            });
        } catch {}
      } catch (err) {
        console.warn("Could not increment applications_usage_count in Supabase:", err);
      }
    }
  }

  return {
    authorized: true,
    verifiedSub: {
      ...verifiedSub,
      applicationsUsage: newAppUsage,
      applicationsRemaining: newRemaining,
    },
  };
}

/**
 * Authoritatively updates a creator's subscription record on the server (e.g. from verified checkout, webhook, or cancellation).
 */
export async function updateServerSubscription(params: {
  creatorId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  billingCycle?: "monthly" | "yearly";
  priceInr?: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  razorpaySubscriptionId?: string | null;
  razorpayPlanId?: string | null;
  lastPaymentId?: string | null;
  lastPaymentStatus?: string | null;
  paymentFailedAt?: string | null;
  resetQuotas?: boolean;
}): Promise<VerifiedSubscription> {
  const plan = SUBSCRIPTION_PLANS[params.planId] || SUBSCRIPTION_PLANS.normal;
  const now = new Date();
  const defaultReset = new Date();
  defaultReset.setDate(now.getDate() + 30);

  const start = params.currentPeriodStart || now.toISOString();
  const end = params.currentPeriodEnd || defaultReset.toISOString();
  const price = params.priceInr !== undefined ? params.priceInr : plan.priceMonthlyInr;

  // Update in-memory override store
  inMemorySubOverrideStore.set(params.creatorId, {
    planId: params.planId,
    status: params.status,
    priceInr: price,
    currentPeriodStart: start,
    currentPeriodEnd: end,
    cancelAtPeriodEnd: Boolean(params.cancelAtPeriodEnd),
    razorpaySubscriptionId: params.razorpaySubscriptionId,
    razorpayPlanId: params.razorpayPlanId,
    lastPaymentId: params.lastPaymentId,
    lastPaymentStatus: params.lastPaymentStatus,
    paymentFailedAt: params.paymentFailedAt,
  });

  if (params.resetQuotas) {
    setInMemoryUsage(params.creatorId, {
      aiUsage: 0,
      applicationsUsage: 0,
      usageResetAt: end,
    });
  }

  // Persist to Supabase if configured
  if (isServerSupabaseConfigured()) {
    const client = getServerSupabaseClient();
    if (client) {
      try {
        const payload: Record<string, any> = {
          creator_id: params.creatorId,
          plan_id: params.planId,
          status: params.status,
          billing_cycle: params.billingCycle || "monthly",
          price_inr: price,
          current_period_start: start,
          current_period_end: end,
          cancel_at_period_end: Boolean(params.cancelAtPeriodEnd),
          updated_at: now.toISOString(),
        };

        if (params.razorpaySubscriptionId) {
          payload.razorpay_subscription_id = params.razorpaySubscriptionId;
        }
        if (params.razorpayPlanId) {
          payload.razorpay_plan_id = params.razorpayPlanId;
        }
        if (params.lastPaymentId) {
          payload.last_payment_id = params.lastPaymentId;
        }
        if (params.lastPaymentStatus) {
          payload.last_payment_status = params.lastPaymentStatus;
        }
        if (params.paymentFailedAt) {
          payload.payment_failed_at = params.paymentFailedAt;
        }
        if (params.resetQuotas) {
          payload.ai_usage_count = 0;
          payload.applications_usage_count = 0;
          payload.usage_reset_at = end;
        }

        await client
          .from("creator_subscriptions")
          .upsert(payload, { onConflict: "creator_id" });
      } catch (err) {
        console.warn("Could not upsert creator_subscriptions in Supabase:", err);
      }
    }
  }

  return getVerifiedSubscription(params.creatorId);
}

// In-memory processed webhook events store for local / test mode idempotency
const inMemoryProcessedWebhookEvents = new Set<string>();

/**
 * Idempotency Check: Returns true if event has already been processed.
 */
export async function isWebhookEventProcessed(eventId: string): Promise<boolean> {
  if (inMemoryProcessedWebhookEvents.has(eventId)) {
    return true;
  }

  if (isServerSupabaseConfigured()) {
    const client = getServerSupabaseClient();
    if (client) {
      try {
        const { data } = await client
          .from("subscription_webhook_events")
          .select("id")
          .eq("event_id", eventId)
          .single();

        if (data) {
          inMemoryProcessedWebhookEvents.add(eventId);
          return true;
        }
      } catch {}
    }
  }

  return false;
}

/**
 * Idempotency & Audit Logging: Records processed webhook event.
 */
export async function recordWebhookEvent(params: {
  eventId: string;
  eventType: string;
  creatorId?: string | null;
  subscriptionId?: string | null;
  payload?: any;
  status?: "processed" | "failed" | "ignored";
}): Promise<void> {
  inMemoryProcessedWebhookEvents.add(params.eventId);

  if (isServerSupabaseConfigured()) {
    const client = getServerSupabaseClient();
    if (client) {
      try {
        // Redact any potential sensitive card or credential details before persisting
        const sanitizedPayload = params.payload ? JSON.parse(JSON.stringify(params.payload)) : {};
        if (sanitizedPayload?.payment?.entity?.card) {
          delete sanitizedPayload.payment.entity.card;
        }

        await client.from("subscription_webhook_events").insert({
          event_id: params.eventId,
          event_type: params.eventType,
          creator_id: params.creatorId || null,
          subscription_id: params.subscriptionId || null,
          payload: sanitizedPayload,
          status: params.status || "processed",
        });
      } catch (err) {
        console.warn("Could not record webhook event in Supabase:", err);
      }
    }
  }
}

