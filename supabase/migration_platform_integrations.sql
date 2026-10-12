-- ==============================================================================
-- Creator Engine - Real Platform Integrations Migration
-- Adds connected_accounts with Row Level Security (RLS)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store real social platform connections and snapshots
CREATE TABLE IF NOT EXISTS public.connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin')),
    platform_account_id TEXT, -- e.g. YouTube channel ID, IG Business ID, LinkedIn sub
    profile_name TEXT NOT NULL,
    handle TEXT NOT NULL,
    profile_url TEXT NOT NULL,
    avatar_url TEXT,
    description TEXT,
    
    -- Secure server-side OAuth tokens (restricted, never sent in client queries)
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    
    -- Status & Provenance
    authorization_status TEXT NOT NULL DEFAULT 'public_only' 
        CHECK (authorization_status IN ('not_required', 'public_only', 'authorized', 'expired', 'unauthorized')),
    data_state TEXT NOT NULL DEFAULT 'live'
        CHECK (data_state IN ('live', 'cached_live', 'user_entered', 'demo', 'connection_required', 'data_unavailable')),
    data_completeness TEXT NOT NULL DEFAULT 'partial'
        CHECK (data_completeness IN ('full', 'partial', 'minimal', 'none')),
    is_verified BOOLEAN NOT NULL DEFAULT true,

    -- Normalized Metrics (represent unavailable metrics as NULL, never fake zero)
    follower_count BIGINT,
    follower_count_source TEXT NOT NULL DEFAULT 'official_api'
        CHECK (follower_count_source IN ('official_api', 'user_entered', 'estimated', 'unavailable')),
    is_subscriber_count_hidden BOOLEAN DEFAULT false,
    
    total_views BIGINT,
    total_views_source TEXT NOT NULL DEFAULT 'official_api'
        CHECK (total_views_source IN ('official_api', 'user_entered', 'estimated', 'unavailable')),
    
    media_count INTEGER,
    media_count_source TEXT NOT NULL DEFAULT 'official_api'
        CHECK (media_count_source IN ('official_api', 'user_entered', 'estimated', 'unavailable')),
    
    avg_engagement_rate NUMERIC(5,2),
    avg_engagement_rate_source TEXT NOT NULL DEFAULT 'official_api'
        CHECK (avg_engagement_rate_source IN ('official_api', 'user_entered', 'estimated', 'unavailable')),

    -- JSON arrays for recent media and platform constraints
    recent_media JSONB DEFAULT '[]'::jsonb,
    limitations JSONB DEFAULT '[]'::jsonb,
    
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate connections for the same account per user
    CONSTRAINT unique_user_platform_handle UNIQUE (user_id, platform, handle)
);

-- Indices for rapid lookup
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_id ON public.connected_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_platform ON public.connected_accounts(platform);

-- Enable Row Level Security
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view own connected accounts" ON public.connected_accounts;
DROP POLICY IF EXISTS "Users can insert own connected accounts" ON public.connected_accounts;
DROP POLICY IF EXISTS "Users can update own connected accounts" ON public.connected_accounts;
DROP POLICY IF EXISTS "Users can delete own connected accounts" ON public.connected_accounts;

-- Row Level Security: Authenticated users can only read, write, and delete their own connected accounts
CREATE POLICY "Users can view own connected accounts"
    ON public.connected_accounts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connected accounts"
    ON public.connected_accounts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connected accounts"
    ON public.connected_accounts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connected accounts"
    ON public.connected_accounts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Service role bypass is automatic in Supabase for server-side management
