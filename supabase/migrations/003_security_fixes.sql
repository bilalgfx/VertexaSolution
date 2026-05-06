-- Migration: Security Fixes
-- Fixes: RLS enabled on all public tables + mutable search_path on RPC functions
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- Safe to run: all API routes use the service role key, which bypasses RLS automatically.

-- ============================================================
-- 1. Enable Row Level Security on all exposed tables
-- ============================================================

ALTER TABLE public.contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_availability     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbound_campaigns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbound_call_logs     ENABLE ROW LEVEL SECURITY;

-- No explicit policies needed: the service_role key used by all API routes
-- bypasses RLS entirely. Anon/public access is blocked by default.

-- ============================================================
-- 2. Fix mutable search_path on RPC functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_campaign_answered(campaign_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.outbound_campaigns
  SET answered = answered + 1
  WHERE id = campaign_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_campaign_stat(campaign_id UUID, stat_col TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF stat_col = 'interested' THEN
    UPDATE public.outbound_campaigns SET interested = interested + 1 WHERE id = campaign_id;
  ELSIF stat_col = 'booked' THEN
    UPDATE public.outbound_campaigns SET booked = booked + 1 WHERE id = campaign_id;
  END IF;
END;
$$;
