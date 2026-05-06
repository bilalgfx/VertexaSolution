-- Migration: Outbound Call Campaigns
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS outbound_campaigns (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'draft',
  total_calls  INTEGER DEFAULT 0,
  answered     INTEGER DEFAULT 0,
  interested   INTEGER DEFAULT 0,
  booked       INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_campaign_status CHECK (status IN ('draft','running','completed','paused'))
);

CREATE TABLE IF NOT EXISTS outbound_call_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID REFERENCES outbound_campaigns(id) ON DELETE CASCADE,
  contact_name    TEXT,
  contact_phone   TEXT NOT NULL,
  contact_company TEXT,
  contact_website TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  outcome         TEXT,
  retry_count     INTEGER DEFAULT 0,
  retry_at        TIMESTAMPTZ,
  vapi_call_id    TEXT,
  booked_date     DATE,
  booked_time     TIME,
  collected_email TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_call_status CHECK (status IN (
    'pending','calling','answered','no_answer',
    'interested','not_interested','booked','failed','retry_scheduled'
  ))
);
