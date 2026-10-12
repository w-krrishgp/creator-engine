-- ==============================================================================
-- Migration: Add Creator Subscriptions Table, Razorpay Tracking & Idempotent Webhook Events
-- Links membership tiers (normal, pro, pro_plus) to creator profiles & users
-- Enforces strict Row Level Security (RLS) preventing unauthorized reads/tampering
-- ==============================================================================

-- 1. CREATOR SUBSCRIPTIONS TABLE
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
    -- Razorpay Subscription & Provider References
    razorpay_subscription_id TEXT UNIQUE,
    razorpay_customer_id TEXT,
    razorpay_plan_id TEXT,
    last_payment_id TEXT,
    last_payment_status TEXT,
    payment_failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_creator_subscription UNIQUE (creator_id)
);

-- Ensure columns exist if table was already created
ALTER TABLE public.creator_subscriptions ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT UNIQUE;
ALTER TABLE public.creator_subscriptions ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;
ALTER TABLE public.creator_subscriptions ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT;
ALTER TABLE public.creator_subscriptions ADD COLUMN IF NOT EXISTS last_payment_id TEXT;
ALTER TABLE public.creator_subscriptions ADD COLUMN IF NOT EXISTS last_payment_status TEXT;
ALTER TABLE public.creator_subscriptions ADD COLUMN IF NOT EXISTS payment_failed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_user ON public.creator_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_plan ON public.creator_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_rzp_sub ON public.creator_subscriptions(razorpay_subscription_id);

-- 2. SUBSCRIPTION USAGE AUDIT LOGS
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

-- 3. WEBHOOK EVENTS TABLE (CRITICAL SECURITY: Guarantees Idempotency & Prevents Replay Attacks)
CREATE TABLE IF NOT EXISTS public.subscription_webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    creator_id TEXT REFERENCES public.creator_profiles(id) ON DELETE SET NULL,
    subscription_id TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('processed', 'failed', 'ignored')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.subscription_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_sub_id ON public.subscription_webhook_events(subscription_id);

-- Automatic timestamp trigger for creator_subscriptions
DROP TRIGGER IF EXISTS set_timestamp_creator_subscriptions ON public.creator_subscriptions;
CREATE TRIGGER set_timestamp_creator_subscriptions
    BEFORE UPDATE ON public.creator_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation:
--  - Users can ONLY read their own subscription record
--  - Users CANNOT insert, update, or alter subscription tiers or quotas from the client
--  - Only service_role (server routes) can modify subscriptions, log usage, and store webhook events
-- ------------------------------------------------------------------------------
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_webhook_events ENABLE ROW LEVEL SECURITY;

-- Subscriptions SELECT Policy
DROP POLICY IF EXISTS "Subscriptions select policy" ON public.creator_subscriptions;
DROP POLICY IF EXISTS "Allow read subscriptions for demo or owner" ON public.creator_subscriptions;
CREATE POLICY "Allow read subscriptions for demo or owner"
    ON public.creator_subscriptions FOR SELECT
    TO public
    USING (
        creator_id IN ('rahul', 'priya') 
        OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

-- Subscriptions INSERT/UPDATE/DELETE: Restricted to service_role ONLY
DROP POLICY IF EXISTS "Allow write subscriptions for demo or owner" ON public.creator_subscriptions;
DROP POLICY IF EXISTS "Deny client subscription writes" ON public.creator_subscriptions;
DROP POLICY IF EXISTS "Allow service role full access on subscriptions" ON public.creator_subscriptions;
CREATE POLICY "Allow service role full access on subscriptions"
    ON public.creator_subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Usage Logs SELECT Policy
DROP POLICY IF EXISTS "Allow read usage logs for demo or owner" ON public.subscription_usage_logs;
CREATE POLICY "Allow read usage logs for demo or owner"
    ON public.subscription_usage_logs FOR SELECT
    TO public
    USING (
        creator_id IN ('rahul', 'priya')
        OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

-- Usage Logs INSERT/UPDATE/DELETE: Restricted to service_role ONLY
DROP POLICY IF EXISTS "Allow service role full access on usage logs" ON public.subscription_usage_logs;
CREATE POLICY "Allow service role full access on usage logs"
    ON public.subscription_usage_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Webhook Events Policies: Read restricted to owners/demos, write restricted solely to service_role
DROP POLICY IF EXISTS "Allow read webhook events for demo or owner" ON public.subscription_webhook_events;
CREATE POLICY "Allow read webhook events for demo or owner"
    ON public.subscription_webhook_events FOR SELECT
    TO public
    USING (
        creator_id IN ('rahul', 'priya')
        OR (auth.uid() IS NOT NULL AND auth.uid() = (SELECT user_id FROM public.creator_subscriptions WHERE creator_id = subscription_webhook_events.creator_id))
    );

DROP POLICY IF EXISTS "Allow service role full access on webhook events" ON public.subscription_webhook_events;
CREATE POLICY "Allow service role full access on webhook events"
    ON public.subscription_webhook_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. SEED INITIAL PERSONAS (Rahul = Normal, Priya = Pro)
-- ------------------------------------------------------------------------------
INSERT INTO public.creator_subscriptions (creator_id, plan_id, status, price_inr, ai_usage_count, applications_usage_count)
VALUES
    ('rahul', 'normal', 'active', 0, 0, 0),
    ('priya', 'pro', 'active', 500, 0, 0)
ON CONFLICT (creator_id) DO UPDATE
SET
    plan_id = EXCLUDED.plan_id,
    price_inr = EXCLUDED.price_inr,
    updated_at = NOW();
