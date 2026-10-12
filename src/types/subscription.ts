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
  createdAt: string;
  updatedAt: string;
}
