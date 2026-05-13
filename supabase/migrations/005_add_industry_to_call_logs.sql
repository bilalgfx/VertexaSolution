-- Migration: Add contact_industry to outbound_call_logs
-- Run in Supabase SQL Editor

ALTER TABLE outbound_call_logs ADD COLUMN IF NOT EXISTS contact_industry TEXT;
