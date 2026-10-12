export type PlanId = "normal" | "pro" | "pro_plus";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete";

export type BillingCycle = "monthly" | "yearly";

export interface PlanLimits {
  maxProfiles: number;
  maxApplicationsPerMonth: number;
  aiRecommendationsPerMonth: number;
  maxActiveActions: number;
  roadmapPhasesAllowed: number; // 1 = 30 days, 3 = 90 days
  hasDynamicPitchGenerator: boolean;
  hasCustomInvoicing: boolean;
  hasWhiteLabelMediaKit: boolean;
  hasDirectBrandIntros: boolean;
  supportLevel: "Community" | "Priority Email" | "Dedicated 1:1 Manager";
}

export interface PlanFeatureItem {
  name: string;
  included: boolean;
  note?: string;
}

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  priceMonthlyInr: number;
  priceFormatted: string;
  badge?: string;
  isPopular?: boolean;
  accentColor: string; // Tailwind color token
  cardBorderColor: string;
  features: string[];
  limits: PlanLimits;
  featureMatrix: {
    category: string;
    items: PlanFeatureItem[];
  }[];
}

export interface SubscriptionUsage {
  aiUsage: number;
  aiLimit: number;
  aiRemaining: number;
  applicationsUsage: number;
  applicationsLimit: number;
  applicationsRemaining: number;
  usageResetAt: string;
}

export interface SubscriptionRecord {
  id: string;
  creatorId: string;
  userId?: string | null;
  planId: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  priceInr: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  aiUsageCount?: number;
  applicationsUsageCount?: number;
  usageResetAt?: string;
  razorpaySubscriptionId?: string | null;
  razorpayCustomerId?: string | null;
  razorpayPlanId?: string | null;
  lastPaymentId?: string | null;
  lastPaymentStatus?: string | null;
  paymentFailedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RazorpayCheckoutConfig {
  keyId: string;
  subscriptionId: string;
  planId: PlanId;
  amount: number;
  currency: string;
  name: string;
  description: string;
}

export interface RazorpayVerificationPayload {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
  creatorId: string;
  planId: PlanId;
}

