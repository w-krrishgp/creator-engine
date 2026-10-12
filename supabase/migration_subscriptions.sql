-- ==============================================================================
-- Migration: Add Creator Subscriptions Table
-- Links membership tiers (normal, pro, pro_plus) to creator profiles & users
-- ==============================================================================

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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_creator_subscription UNIQUE (creator_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_plan ON public.creator_subscriptions(plan_id);

-- Automatic timestamp trigger
DROP TRIGGER IF EXISTS set_timestamp_creator_subscriptions ON public.creator_subscriptions;
CREATE TRIGGER set_timestamp_creator_subscriptions
    BEFORE UPDATE ON public.creator_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS)
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read subscriptions for demo or owner" ON public.creator_subscriptions;
CREATE POLICY "Allow read subscriptions for demo or owner"
    ON public.creator_subscriptions FOR SELECT
    USING (creator_id IN ('rahul', 'priya') OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow write subscriptions for demo or owner" ON public.creator_subscriptions;
CREATE POLICY "Allow write subscriptions for demo or owner"
    ON public.creator_subscriptions FOR ALL
    USING (creator_id IN ('rahul', 'priya') OR auth.uid() = user_id);

-- Seed initial subscriptions for demo personas
INSERT INTO public.creator_subscriptions (creator_id, plan_id, status, price_inr)
VALUES
    ('rahul', 'normal', 'active', 0),
    ('priya', 'pro', 'active', 500)
ON CONFLICT (creator_id) DO UPDATE
SET
    plan_id = EXCLUDED.plan_id,
    price_inr = EXCLUDED.price_inr;
