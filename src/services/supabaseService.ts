import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  CreatorProfile,
  Opportunity,
  ActionItem,
  ActionStatus,
  PlatformType,
} from "@/types/creator";

export interface SyncStatus {
  isConfigured: boolean;
  connected: boolean;
  lastSyncedAt?: string;
  errorMessage?: string;
}

/**
 * Service providing persistence for Creator Profiles, Applications, and Actions.
 * When Supabase credentials are not configured, it gracefully signals demo mode.
 */
export const supabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async testConnection(): Promise<SyncStatus> {
    if (!isSupabaseConfigured()) {
      return {
        isConfigured: false,
        connected: false,
        errorMessage: "Supabase credentials not configured in environment variables.",
      };
    }

    const client = getSupabaseClient();
    if (!client) {
      return { isConfigured: true, connected: false, errorMessage: "Client unavailable" };
    }

    try {
      const { error } = await client
        .from("opportunities")
        .select("id")
        .limit(1);

      if (error) {
        return { isConfigured: true, connected: false, errorMessage: error.message };
      }

      return {
        isConfigured: true,
        connected: true,
        lastSyncedAt: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { isConfigured: true, connected: false, errorMessage };
    }
  },

  async getProfile(creatorId: string): Promise<CreatorProfile | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from("creator_profiles")
        .select("*")
        .eq("id", creatorId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        handle: data.handle,
        avatar: data.avatar || "",
        title: data.title || "",
        niche: data.niche,
        primaryPlatform: data.primary_platform,
        followerCount: data.follower_count,
        secondaryPlatform: data.secondary_platform,
        secondaryFollowers: data.secondary_followers,
        engagementRate: Number(data.engagement_rate),
        audienceDemographic: data.audience_demographic || "",
        contentFormat: data.content_format || "",
        contentFrequency: data.content_frequency || "",
        creatorStage: data.creator_stage,
        experienceLevel: data.experience_level,
        primaryGoal: data.primary_goal || "",
        monetisationGoals: data.monetisation_goals || [],
        monthlyIncomeTarget: Number(data.monthly_income_target),
        bio: data.bio || "",
        location: data.location || "",
        topics: data.topics || [],
        activeDealsCount: data.active_deals_count,
        estimatedPipelineValue: Number(data.estimated_pipeline_value),
        monthlyGrowthRate: Number(data.monthly_growth_rate),
        avgImpressionsPerPost: data.avg_impressions_per_post,
        mediaKitLink: data.media_kit_link,
        isManuallyReported: data.is_manually_reported,
        isOnboarded: data.is_onboarded,
        positioningStatement: data.positioning_statement,
      };
    } catch {
      return null;
    }
  },

  async saveProfile(profile: CreatorProfile): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from("creator_profiles").upsert(
        {
          id: profile.id,
          name: profile.name,
          handle: profile.handle,
          avatar: profile.avatar,
          title: profile.title,
          niche: profile.niche,
          primary_platform: profile.primaryPlatform,
          follower_count: profile.followerCount,
          secondary_platform: profile.secondaryPlatform || "",
          secondary_followers: profile.secondaryFollowers || 0,
          engagement_rate: profile.engagementRate,
          audience_demographic: profile.audienceDemographic,
          content_format: profile.contentFormat,
          content_frequency: profile.contentFrequency,
          creator_stage: profile.creatorStage,
          experience_level: profile.experienceLevel,
          primary_goal: profile.primaryGoal,
          monetisation_goals: profile.monetisationGoals || [],
          monthly_income_target: profile.monthlyIncomeTarget,
          bio: profile.bio,
          location: profile.location,
          topics: profile.topics || [],
          active_deals_count: profile.activeDealsCount,
          estimated_pipeline_value: profile.estimatedPipelineValue,
          monthly_growth_rate: profile.monthlyGrowthRate,
          avg_impressions_per_post: profile.avgImpressionsPerPost,
          media_kit_link: profile.mediaKitLink,
          is_manually_reported: profile.isManuallyReported,
          is_onboarded: profile.isOnboarded,
          positioning_statement: profile.positioningStatement,
        },
        { onConflict: "id" }
      );

      return !error;
    } catch {
      return false;
    }
  },

  async getOpportunities(): Promise<Opportunity[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return null;

      return (data as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        brand: String(d.brand),
        brandLogo: d.brand_logo ? String(d.brand_logo) : "",
        brandCategory: String(d.brand_category),
        title: String(d.title),
        description: String(d.description),
        niche: Array.isArray(d.niche) ? (d.niche as string[]) : [],
        platform: (d.platform as PlatformType | "Multi-Platform") || "Multi-Platform",
        minFollowers: Number(d.min_followers),
        minEngagementRate: d.min_engagement_rate ? Number(d.min_engagement_rate) : undefined,
        budgetRange: String(d.budget_range),
        budgetMin: Number(d.budget_min),
        budgetMax: Number(d.budget_max),
        deadline: String(d.deadline),
        deliverables: Array.isArray(d.deliverables) ? (d.deliverables as string[]) : [],
        status: "Available" as const,
        targetAudience: d.target_audience ? String(d.target_audience) : "",
        targetLocation: d.target_location ? String(d.target_location) : undefined,
        eligibilityRequirements: Array.isArray(d.eligibility_requirements) ? (d.eligibility_requirements as string[]) : [],
        perks: Array.isArray(d.perks) ? (d.perks as string[]) : [],
        sponsoredTag: Boolean(d.sponsored_tag),
      }));
    } catch {
      return null;
    }
  },

  async saveApplication(
    appReference: string,
    opportunityId: string,
    creatorId: string,
    fee?: string,
    notes?: string
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from("opportunity_applications").upsert(
        {
          application_reference: appReference,
          opportunity_id: opportunityId,
          creator_id: creatorId,
          status: "Applied",
          applied_date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          applied_fee: fee,
          applied_notes: notes,
        },
        { onConflict: "application_reference" }
      );

      return !error;
    } catch {
      return false;
    }
  },

  async getActions(creatorId: string): Promise<ActionItem[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from("action_items")
        .select("*")
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false });

      if (error || !data) return null;

      return (data as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        creatorId: String(d.creator_id || creatorId),
        title: String(d.title),
        category: d.category as ActionItem["category"],
        priority: d.priority as ActionItem["priority"],
        reason: String(d.reason),
        deadline: String(d.deadline),
        estimatedTime: String(d.estimated_time),
        status: d.status as ActionStatus,
        completed: Boolean(d.completed),
        relatedType: d.related_type as ActionItem["relatedType"],
        relatedId: d.related_id ? String(d.related_id) : undefined,
        relatedTitle: d.related_title ? String(d.related_title) : undefined,
        relatedLink: d.related_link ? String(d.related_link) : undefined,
      }));
    } catch {
      return null;
    }
  },

  async saveAction(action: ActionItem): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from("action_items").upsert(
        {
          id: action.id,
          creator_id: action.creatorId,
          title: action.title,
          category: action.category,
          priority: action.priority,
          reason: action.reason,
          deadline: action.deadline,
          estimated_time: action.estimatedTime,
          status: action.status,
          completed: action.completed,
          related_type: action.relatedType || null,
          related_id: action.relatedId || null,
          related_title: action.relatedTitle || null,
          related_link: action.relatedLink || null,
        },
        { onConflict: "id" }
      );

      return !error;
    } catch {
      return false;
    }
  },

  async deleteAction(actionId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from("action_items").delete().eq("id", actionId);
      return !error;
    } catch {
      return false;
    }
  },
};
