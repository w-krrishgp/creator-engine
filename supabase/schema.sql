-- ==============================================================================
-- Creator Engine - Relational Database Schema & Row Level Security (RLS)
-- Designed for Supabase / PostgreSQL
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CREATOR PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id TEXT PRIMARY KEY, -- e.g. 'rahul', 'priya', or auth.users UUID
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    handle TEXT NOT NULL,
    avatar TEXT,
    title TEXT,
    niche TEXT NOT NULL,
    primary_platform TEXT NOT NULL,
    follower_count INTEGER NOT NULL DEFAULT 0,
    secondary_platform TEXT DEFAULT '',
    secondary_followers INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    audience_demographic TEXT,
    content_format TEXT,
    content_frequency TEXT,
    creator_stage TEXT NOT NULL,
    experience_level TEXT,
    primary_goal TEXT,
    monetisation_goals JSONB DEFAULT '[]'::jsonb,
    monthly_income_target NUMERIC(12,2) DEFAULT 0.00,
    bio TEXT,
    location TEXT,
    topics JSONB DEFAULT '[]'::jsonb,
    active_deals_count INTEGER DEFAULT 0,
    estimated_pipeline_value NUMERIC(12,2) DEFAULT 0.00,
    monthly_growth_rate NUMERIC(5,2) DEFAULT 0.00,
    avg_impressions_per_post INTEGER DEFAULT 0,
    media_kit_link TEXT,
    is_manually_reported BOOLEAN DEFAULT true,
    is_onboarded BOOLEAN DEFAULT false,
    positioning_statement TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CREATOR PREFERENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id TEXT NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system',
    notification_channels JSONB DEFAULT '["email"]'::jsonb,
    auto_pitch_reminders BOOLEAN DEFAULT true,
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. OPPORTUNITIES TABLE (Brand Campaign Marketplace)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
    id TEXT PRIMARY KEY, -- e.g. 'opp-myprotein', 'opp-wintwealth'
    brand TEXT NOT NULL,
    brand_logo TEXT NOT NULL,
    brand_category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    niche JSONB NOT NULL DEFAULT '[]'::jsonb,
    platform TEXT NOT NULL,
    min_followers INTEGER NOT NULL DEFAULT 0,
    min_engagement_rate NUMERIC(5,2) DEFAULT 0.00,
    budget_range TEXT NOT NULL,
    budget_min NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    budget_max NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deadline TEXT NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_audience TEXT,
    target_location TEXT,
    eligibility_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    perks JSONB DEFAULT '[]'::jsonb,
    sponsored_tag BOOLEAN DEFAULT false,
    is_public_demo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. OPPORTUNITY APPLICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_reference TEXT NOT NULL UNIQUE, -- e.g. 'CE-APP-9041'
    opportunity_id TEXT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    creator_id TEXT NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Accepted', 'Rejected', 'Withdrawn', 'Saved')),
    applied_date TEXT NOT NULL,
    applied_fee TEXT,
    applied_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ACTION ITEMS TABLE (Action Centre & Execution Queue)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_items (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Growth', 'Monetisation', 'Brand Pitch', 'Audience Trust')),
    priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    reason TEXT NOT NULL,
    deadline TEXT NOT NULL,
    estimated_time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Not started', 'In progress', 'Completed')),
    completed BOOLEAN NOT NULL DEFAULT false,
    related_type TEXT CHECK (related_type IS NULL OR related_type IN ('roadmap', 'opportunity', 'monetisation', 'goal')),
    related_id TEXT,
    related_title TEXT,
    related_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON public.creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_preferences_creator_id ON public.creator_preferences(creator_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_apps_creator ON public.opportunity_applications(creator_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_apps_opp ON public.opportunity_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_action_items_creator ON public.action_items(creator_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON public.action_items(status);

-- ------------------------------------------------------------------------------
-- 7. AUTOMATIC TIMESTAMP TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_creator_profiles ON public.creator_profiles;
CREATE TRIGGER set_timestamp_creator_profiles
    BEFORE UPDATE ON public.creator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_creator_preferences ON public.creator_preferences;
CREATE TRIGGER set_timestamp_creator_preferences
    BEFORE UPDATE ON public.creator_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_opp_apps ON public.opportunity_applications;
CREATE TRIGGER set_timestamp_opp_apps
    BEFORE UPDATE ON public.opportunity_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_action_items ON public.action_items;
CREATE TRIGGER set_timestamp_action_items
    BEFORE UPDATE ON public.action_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Opportunities Policies (Public demo opportunities are readable by anyone)
DROP POLICY IF EXISTS "Public read access for demo opportunities" ON public.opportunities;
CREATE POLICY "Public read access for demo opportunities"
    ON public.opportunities FOR SELECT
    USING (is_public_demo = true);

-- Creator Profiles Policies
DROP POLICY IF EXISTS "Allow public read for demo creator profiles" ON public.creator_profiles;
CREATE POLICY "Allow public read for demo creator profiles"
    ON public.creator_profiles FOR SELECT
    USING (id IN ('rahul', 'priya') OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own creator profile" ON public.creator_profiles;
CREATE POLICY "Users can insert their own creator profile"
    ON public.creator_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id OR id IN ('rahul', 'priya'));

DROP POLICY IF EXISTS "Users can update their own creator profile" ON public.creator_profiles;
CREATE POLICY "Users can update their own creator profile"
    ON public.creator_profiles FOR UPDATE
    USING (auth.uid() = user_id OR id IN ('rahul', 'priya'));

-- Creator Preferences Policies
DROP POLICY IF EXISTS "Allow read preferences for demo or owner" ON public.creator_preferences;
CREATE POLICY "Allow read preferences for demo or owner"
    ON public.creator_preferences FOR SELECT
    USING (creator_id IN ('rahul', 'priya') OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.creator_preferences;
CREATE POLICY "Users can manage their own preferences"
    ON public.creator_preferences FOR ALL
    USING (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

-- Opportunity Applications Policies
DROP POLICY IF EXISTS "Allow read applications for demo or owner" ON public.opportunity_applications;
CREATE POLICY "Allow read applications for demo or owner"
    ON public.opportunity_applications FOR SELECT
    USING (creator_id IN ('rahul', 'priya') OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow insert application for demo or owner" ON public.opportunity_applications;
CREATE POLICY "Allow insert application for demo or owner"
    ON public.opportunity_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

DROP POLICY IF EXISTS "Allow update application for demo or owner" ON public.opportunity_applications;
CREATE POLICY "Allow update application for demo or owner"
    ON public.opportunity_applications FOR UPDATE
    USING (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

DROP POLICY IF EXISTS "Allow delete application for demo or owner" ON public.opportunity_applications;
CREATE POLICY "Allow delete application for demo or owner"
    ON public.opportunity_applications FOR DELETE
    USING (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

-- Action Items Policies
DROP POLICY IF EXISTS "Allow read action items for demo or owner" ON public.action_items;
CREATE POLICY "Allow read action items for demo or owner"
    ON public.action_items FOR SELECT
    USING (creator_id IN ('rahul', 'priya') OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow insert action items for demo or owner" ON public.action_items;
CREATE POLICY "Allow insert action items for demo or owner"
    ON public.action_items FOR INSERT
    WITH CHECK (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

DROP POLICY IF EXISTS "Allow update action items for demo or owner" ON public.action_items;
CREATE POLICY "Allow update action items for demo or owner"
    ON public.action_items FOR UPDATE
    USING (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

DROP POLICY IF EXISTS "Allow delete action items for demo or owner" ON public.action_items;
CREATE POLICY "Allow delete action items for demo or owner"
    ON public.action_items FOR DELETE
    USING (auth.uid() = user_id OR creator_id IN ('rahul', 'priya'));

-- ------------------------------------------------------------------------------
-- 9. INITIAL SEED DATA (Rahul, Priya & Public Demo Opportunities)
-- ------------------------------------------------------------------------------
INSERT INTO public.creator_profiles (
    id, name, handle, avatar, title, niche, primary_platform, follower_count,
    secondary_platform, secondary_followers, engagement_rate, audience_demographic,
    content_format, content_frequency, creator_stage, experience_level, primary_goal,
    monetisation_goals, monthly_income_target, bio, location, topics, active_deals_count,
    estimated_pipeline_value, monthly_growth_rate, avg_impressions_per_post,
    media_kit_link, is_manually_reported, is_onboarded, positioning_statement
) VALUES
(
    'rahul', 'Rahul Sharma', '@rahulfit.india', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Student Fitness & Calisthenics Creator', 'Fitness & Nutrition', 'Instagram', 15000,
    'YouTube', 2400, 4.8, 'College students & gym beginners (18-24, India)',
    'Short-form vertical video (Reels)', '4-5 posts per week', 'Micro (10k-50k)', 'Growing (1-3 yrs)',
    'Land first 3 commercial fitness sponsorships & reach ₹75k/mo',
    '["Brand Collaborations", "Affiliate Supplements", "₹299 Digital Workout Guide"]'::jsonb,
    75000, 'Helping college students build real muscle without expensive supplements or gym memberships. Calisthenics & dorm diet hacks.',
    'Bengaluru, India', '["Dorm Workouts", "Hostel Diet Hacks", "Budget Protein", "Form Correction"]'::jsonb,
    1, 85000, 12.4, 28500, 'https://creator-engine.demo/kit/rahul', true, true,
    'Democratizing accessible fitness for 15,000+ Indian university students through realistic hostel meal preps and zero-equipment bodyweight training.'
),
(
    'priya', 'Priya Nair', '@priya.finance', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'Personal Finance & Fintech Educator', 'Personal Finance & Investing', 'LinkedIn', 8000,
    'X', 3200, 3.8, 'Salaried tech professionals & first-time investors (24-35, Tier-1 Metros)',
    'Text breakdowns, visual carousels, slide decks', '3 posts per week', 'Nano (1k-10k)', 'Emerging (< 1 yr)',
    'Monetize corporate financial wellness workshops & advisory calls to ₹1.2L/mo',
    '["1:1 Advisory Calls", "Corporate Financial Wellness", "Fintech Brand Partnerships"]'::jsonb,
    120000, 'Ex-consultant breaking down tax optimization, index funds, and stock options for young engineers and product managers.',
    'Mumbai, India', '["Tax Optimization", "Index Funds vs FDs", "ESOPs & RSUs", "Emergency Funds"]'::jsonb,
    2, 140000, 8.6, 14200, 'https://creator-engine.demo/kit/priya', true, true,
    'Empowering early-to-mid career Indian tech professionals with data-backed, zero-jargon frameworks for tax optimization, equity compensation, and passive wealth compounding.'
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Seed Opportunities
INSERT INTO public.opportunities (
    id, brand, brand_logo, brand_category, title, description, niche, platform,
    min_followers, min_engagement_rate, budget_range, budget_min, budget_max, deadline,
    deliverables, target_audience, target_location, eligibility_requirements, perks,
    sponsored_tag, is_public_demo
) VALUES
(
    'opp-myprotein', 'MyProtein India', '🏋️', 'Sports Nutrition & Supplements',
    'Campus Fitness Fuel: Impact Whey Student Campaign',
    'Looking for authentic fitness creators with active student and youth audiences to showcase budget-friendly daily protein hacks, shake recipes, and dorm workout routines.',
    '["Fitness & Nutrition", "Lifestyle"]'::jsonb, 'Instagram', 10000, 3.5,
    '₹25,000 - ₹40,000', 25000, 40000, 'Nov 5, 2026',
    '["2x Instagram Reels (60s) showcasing budget protein recipes & form", "3x Story Frames with exclusive discount link & sticker", "Link-in-bio pinned code for 14 days"]'::jsonb,
    'College students, gym beginners, budget fitness enthusiasts (Age 18-24)', 'Pan-India (University towns & Tier 1 Metros)',
    '["Active Instagram fitness or athletic student lifestyle creator", "Minimum 10,000 verified Instagram followers", "Average engagement rate >= 3.5% on Reels video content", "Core audience demographic based in India (Age 18-24)", "Zero conflicting ongoing contracts with competing protein powder brands"]'::jsonb,
    '["6 months complimentary Impact Whey supply (worth ₹18,000)", "15% recurring affiliate revenue share on creator code sales"]'::jsonb,
    true, true
),
(
    'opp-cultfit', 'Cult.fit', '⚡', 'Fitness & Wellness',
    'Home & Dorm Calisthenics Challenge Promo',
    'Promote the Cultpass Home 30-Day Transformation program. Ideal for creators who demystify workouts without expensive gym machinery.',
    '["Fitness & Nutrition"]'::jsonb, 'Instagram', 12000, 3.0,
    '₹35,000 - ₹55,000', 35000, 55000, 'Nov 12, 2026',
    '["1x Co-authored Instagram Reel demonstrating 5 dorm exercises", "1x Carousel Routine guide with daily schedule", "Cultpass giveaway for 5 community winners"]'::jsonb,
    'Urban youth seeking flexible strength and home workout routines', 'Bengaluru, Delhi-NCR, Mumbai, Hyderabad, Pune',
    '["Fitness creator with verified workout coaching or calisthenics videos", "Minimum 12,000 active followers on Instagram", "Audience concentration in top Indian tier 1 metro cities", "Demonstrated ability to produce high-retention vertical video"]'::jsonb,
    '["Annual Cultpass Black All-Access membership (worth ₹22,000)", "Feature on Cult.fit official app creator reel spotlight"]'::jsonb,
    false, true
),
(
    'opp-wintwealth', 'Wint Wealth', '💎', 'Fixed Return Fintech',
    'Fixed Income for Salaried Millennials: Educational Series',
    'Commissioning credible finance educators to create thought leadership dissecting senior secured bonds vs traditional FDs for young tech employees.',
    '["Personal Finance & Investing", "Fintech"]'::jsonb, 'LinkedIn', 5000, 2.0,
    '₹45,000 - ₹75,000', 45000, 75000, 'Nov 15, 2026',
    '["1x Educational Slide Carousel (8-10 slides) analyzing bond risk metrics", "1x Thought leadership text breakdown citing RBI retail direct", "1x Repost with community Q&A session in comments"]'::jsonb,
    'Corporate professionals, tech employees, salaried millennials looking beyond mutual funds', 'Bengaluru, Hyderabad, Pune, Gurgaon, Mumbai',
    '["Creator focused on personal finance, corporate career, or fintech", "Minimum 5,000 connections/followers on LinkedIn", "Proven capability in educational infographics/carousels", "Clear adherence to SEBI research analyst disclaimer norms"]'::jsonb,
    '["Access to Wint Wealth founders for exclusive briefing", "Annual VIP pass to Wint Wealth Investor Summit"]'::jsonb,
    true, true
),
(
    'opp-zerodha', 'Zerodha Varsity', '📈', 'Financial Literacy',
    'Index Fund & Passive Investing Masterclass Series',
    'Seeking analytical finance creators to produce visual guides simplifying Nifty 50 vs Total Market index investing for first-time salaried earners.',
    '["Personal Finance & Investing"]'::jsonb, 'LinkedIn', 6000, 2.5,
    '₹50,000 - ₹85,000', 50000, 85000, 'Nov 25, 2026',
    '["1x In-depth PDF Carousel: Index Funds vs Active Mutual Funds", "1x Newsletter issue breakdown on rupee-cost averaging", "Featured audio event panelist spot"]'::jsonb,
    'Young working professionals in Indian tech & consulting hubs', 'Pan-India',
    '["Published track record in personal finance or quantitative economics", "Minimum 6,000 followers on LinkedIn", "Clean compliance track record with zero misleading financial claims"]'::jsonb,
    '["Varsity Educator badge and official co-distribution on Zerodha Varsity LinkedIn page"]'::jsonb,
    true, true
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 9. CREATOR SUBSCRIPTIONS TABLE (Membership Plans & Quotas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id TEXT NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    plan_id TEXT NOT NULL DEFAULT 'normal' CHECK (plan_id IN ('normal', 'pro', 'pro_plus')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    price_inr INTEGER NOT NULL DEFAULT 0,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    -- Quota & Usage Tracking
    ai_usage_count INTEGER NOT NULL DEFAULT 0,
    applications_usage_count INTEGER NOT NULL DEFAULT 0,
    usage_reset_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_creator_subscription UNIQUE (creator_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_user ON public.creator_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_plan ON public.creator_subscriptions(plan_id);

-- ------------------------------------------------------------------------------
-- 10. SUBSCRIPTION USAGE AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id TEXT NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('ai_recommendation', 'campaign_application')),
    plan_id TEXT NOT NULL CHECK (plan_id IN ('normal', 'pro', 'pro_plus')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_creator ON public.subscription_usage_logs(creator_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON public.subscription_usage_logs(action_type);

DROP TRIGGER IF EXISTS set_timestamp_creator_subscriptions ON public.creator_subscriptions;
CREATE TRIGGER set_timestamp_creator_subscriptions
    BEFORE UPDATE ON public.creator_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Enforcement
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Subscriptions select policy" ON public.creator_subscriptions;
DROP POLICY IF EXISTS "Allow read subscriptions for demo or owner" ON public.creator_subscriptions;
CREATE POLICY "Allow read subscriptions for demo or owner"
    ON public.creator_subscriptions FOR SELECT
    TO public
    USING (
        creator_id IN ('rahul', 'priya') 
        OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

DROP POLICY IF EXISTS "Allow write subscriptions for demo or owner" ON public.creator_subscriptions;
DROP POLICY IF EXISTS "Deny client subscription writes" ON public.creator_subscriptions;
CREATE POLICY "Allow service role full access on subscriptions"
    ON public.creator_subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read usage logs for demo or owner" ON public.subscription_usage_logs;
CREATE POLICY "Allow read usage logs for demo or owner"
    ON public.subscription_usage_logs FOR SELECT
    TO public
    USING (
        creator_id IN ('rahul', 'priya')
        OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

DROP POLICY IF EXISTS "Allow service role full access on usage logs" ON public.subscription_usage_logs;
CREATE POLICY "Allow service role full access on usage logs"
    ON public.subscription_usage_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

INSERT INTO public.creator_subscriptions (creator_id, plan_id, status, price_inr, ai_usage_count, applications_usage_count)
VALUES
    ('rahul', 'normal', 'active', 0, 0, 0),
    ('priya', 'pro', 'active', 500, 0, 0)
ON CONFLICT (creator_id) DO NOTHING;


