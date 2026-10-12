import { PlanId, SubscriptionPlan } from "@/types/subscription";

/**
 * Single source of truth for Creator Engine subscription tiers, pricing, features, and quotas.
 * All pricing is specified in INR per month as requested:
 * - Normal: ₹0/month
 * - Pro: ₹500/month
 * - Pro+: ₹999/month
 */
export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  normal: {
    id: "normal",
    name: "Normal",
    tagline: "Foundational intelligence for emerging creators",
    description: "Get started with deterministic brand matchmaking, profile calibration, and 30-day foundational roadmaps.",
    priceMonthlyInr: 0,
    priceFormatted: "₹0",
    badge: "Free Forever",
    isPopular: false,
    accentColor: "slate",
    cardBorderColor: "border-slate-200/90",
    features: [
      "1 Verified Creator Profile",
      "Foundational 30-Day Growth Roadmap",
      "Up to 3 Brand Campaign Applications / month",
      "5 Active Action Centre Queue items",
      "Deterministic Brand Compatibility Scoring",
      "Standard ASCI Compliance Checklist",
      "Standard Shareable Media Kit link",
      "Community Support & Guides",
    ],
    limits: {
      maxProfiles: 1,
      maxApplicationsPerMonth: 3,
      aiRecommendationsPerMonth: 2,
      maxActiveActions: 5,
      roadmapPhasesAllowed: 1, // 30 Days only
      hasDynamicPitchGenerator: false,
      hasCustomInvoicing: false,
      hasWhiteLabelMediaKit: false,
      hasDirectBrandIntros: false,
      supportLevel: "Community",
    },
    featureMatrix: [
      {
        category: "Growth & Roadmap",
        items: [
          { name: "30-Day Execution Roadmap", included: true },
          { name: "60 & 90-Day Scaling Phases", included: false, note: "Pro tier" },
          { name: "Content Gap & Topic Angles", included: true, note: "Standard" },
          { name: "Gemini 3.8 Flash AI Synthesis", included: true, note: "2 runs/mo" },
        ],
      },
      {
        category: "Brand Deals & Monetisation",
        items: [
          { name: "Opportunity Marketplace Access", included: true },
          { name: "Monthly Campaign Applications", included: true, note: "Max 3 / mo" },
          { name: "Deterministic Compatibility Matcher", included: true },
          { name: "Cold Pitch Email Generator", included: false, note: "Pro tier" },
          { name: "Direct Brand Introductions", included: false, note: "Pro+ tier" },
        ],
      },
      {
        category: "Workflow & Operations",
        items: [
          { name: "Action Centre Active Capacity", included: true, note: "5 items" },
          { name: "Standard Media Kit Link", included: true },
          { name: "White-label Custom Domain", included: false },
          { name: "Deal Invoicing & Tax Ledger", included: false, note: "Pro+ tier" },
        ],
      },
    ],
  },

  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For scaling creators aiming for ₹50,000+ monthly revenue",
    description: "Unlock full 90-day roadmaps, unlimited campaign applications, dynamic cold pitch generation, and frequent Gemini AI synthesis.",
    priceMonthlyInr: 500,
    priceFormatted: "₹500",
    badge: "Most Popular",
    isPopular: true,
    accentColor: "blue",
    cardBorderColor: "border-[#0870e8]",
    features: [
      "Everything in Normal, plus:",
      "Full 30 / 60 / 90-Day Phased Growth Roadmap",
      "Up to 25 Brand Campaign Applications / month",
      "Up to 25 Active Action Centre Queue items",
      "Gemini 3.8 Flash AI Strategic Synthesis (50 runs/mo)",
      "Dynamic Cold Pitch Generator with brand-tailored hooks",
      "Interactive Media Kit with verified engagement analytics",
      "Priority ASCI Disclosure & Commercial Rate Calculator",
      "Priority Email Support (under 12-hour response)",
    ],
    limits: {
      maxProfiles: 2,
      maxApplicationsPerMonth: 25,
      aiRecommendationsPerMonth: 50,
      maxActiveActions: 25,
      roadmapPhasesAllowed: 3, // Full 90 Days
      hasDynamicPitchGenerator: true,
      hasCustomInvoicing: false,
      hasWhiteLabelMediaKit: false,
      hasDirectBrandIntros: false,
      supportLevel: "Priority Email",
    },
    featureMatrix: [
      {
        category: "Growth & Roadmap",
        items: [
          { name: "30-Day Execution Roadmap", included: true },
          { name: "60 & 90-Day Scaling Phases", included: true },
          { name: "Content Gap & Topic Angles", included: true, note: "Advanced" },
          { name: "Gemini 3.8 Flash AI Synthesis", included: true, note: "50 runs/mo" },
        ],
      },
      {
        category: "Brand Deals & Monetisation",
        items: [
          { name: "Opportunity Marketplace Access", included: true },
          { name: "Monthly Campaign Applications", included: true, note: "25 / mo" },
          { name: "Deterministic Compatibility Matcher", included: true },
          { name: "Cold Pitch Email Generator", included: true },
          { name: "Direct Brand Introductions", included: false, note: "Pro+ tier" },
        ],
      },
      {
        category: "Workflow & Operations",
        items: [
          { name: "Action Centre Active Capacity", included: true, note: "25 items" },
          { name: "Standard Media Kit Link", included: true },
          { name: "White-label Custom Domain", included: false },
          { name: "Deal Invoicing & Tax Ledger", included: false, note: "Pro+ tier" },
        ],
      },
    ],
  },

  pro_plus: {
    id: "pro_plus",
    name: "Pro+",
    tagline: "For high-ticket advisors, talent agencies & professional creators",
    description: "The complete enterprise creator OS: multi-persona management, invoice generation, white-label kits, and direct brand introductions.",
    priceMonthlyInr: 999,
    priceFormatted: "₹999",
    badge: "Agency & Elite",
    isPopular: false,
    accentColor: "purple",
    cardBorderColor: "border-purple-600",
    features: [
      "Everything in Pro, plus:",
      "Multi-Persona Management (Up to 10 Creator Profiles)",
      "High-Volume Campaign Applications (100 / month)",
      "Up to 100 Active Action Centre Queue items",
      "Unlimited Gemini 3.8 Flash Strategic Synthesis (200 runs/mo)",
      "Deal Contract Negotiation Checklist & Clause Review",
      "Professional Automated Invoicing & Tax Ledger (GST / TDS)",
      "White-label Media Kit with Custom Domain support",
      "Direct Brand Introductions & Campaign Priority Listing",
      "Dedicated 1:1 Creator Success Manager on WhatsApp",
    ],
    limits: {
      maxProfiles: 10,
      maxApplicationsPerMonth: 100,
      aiRecommendationsPerMonth: 200,
      maxActiveActions: 100,
      roadmapPhasesAllowed: 3,
      hasDynamicPitchGenerator: true,
      hasCustomInvoicing: true,
      hasWhiteLabelMediaKit: true,
      hasDirectBrandIntros: true,
      supportLevel: "Dedicated 1:1 Manager",
    },
    featureMatrix: [
      {
        category: "Growth & Roadmap",
        items: [
          { name: "30-Day Execution Roadmap", included: true },
          { name: "60 & 90-Day Scaling Phases", included: true },
          { name: "Content Gap & Topic Angles", included: true, note: "Deep Strategic" },
          { name: "Gemini 3.8 Flash AI Synthesis", included: true, note: "200 runs/mo" },
        ],
      },
      {
        category: "Brand Deals & Monetisation",
        items: [
          { name: "Opportunity Marketplace Access", included: true },
          { name: "Monthly Campaign Applications", included: true, note: "100 / mo" },
          { name: "Deterministic Compatibility Matcher", included: true },
          { name: "Cold Pitch Email Generator", included: true, note: "Multi-Variant" },
          { name: "Direct Brand Introductions", included: true },
        ],
      },
      {
        category: "Workflow & Operations",
        items: [
          { name: "Action Centre Active Capacity", included: true, note: "100 items" },
          { name: "Standard Media Kit Link", included: true },
          { name: "White-label Custom Domain", included: true },
          { name: "Deal Invoicing & Tax Ledger", included: true },
        ],
      },
    ],
  },
};

/**
 * Default sample subscriptions for demo personas.
 * Kept clearly identified as sample configurations.
 */
export const SAMPLE_DEFAULT_SUBSCRIPTIONS: Record<string, { planId: PlanId; status: "active"; priceInr: number }> = {
  rahul: {
    planId: "normal",
    status: "active",
    priceInr: 0,
  },
  priya: {
    planId: "pro",
    status: "active",
    priceInr: 500,
  },
};
