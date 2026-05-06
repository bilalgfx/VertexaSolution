-- Migration: Revoke public execute on SECURITY DEFINER functions
-- Fixes: "Public Can Execute SECURITY DEFINER Function" warnings
-- These functions are only called server-side via service_role (VAPI webhook).
-- Anon and authenticated users should never be able to call them directly.

REVOKE EXECUTE ON FUNCTION public.increment_campaign_answered(UUID)     FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_campaign_answered(UUID)     FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_campaign_answered(UUID)     FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.increment_campaign_stat(UUID, TEXT)   FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_campaign_stat(UUID, TEXT)   FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_campaign_stat(UUID, TEXT)   FROM authenticated;
