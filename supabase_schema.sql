-- Run this SQL in your Supabase SQL Editor at:
-- https://app.supabase.com → your project → SQL Editor

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  website TEXT,
  service TEXT,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved leads (from Apollo or manual)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  company TEXT,
  title TEXT,
  linkedin_url TEXT,
  phone TEXT,
  industry TEXT,
  employees TEXT,
  location TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'email_sent', 'qualified', 'closed')),
  notes TEXT,
  source TEXT DEFAULT 'csv',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page view analytics
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin availability for AI agent booking
CREATE TABLE admin_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '17:00',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (day_of_week)
);

-- Booked appointments (created by AI call agent or manually)
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES contact_submissions(id) ON DELETE SET NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  notes TEXT,
  call_transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email campaigns log
CREATE TABLE email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_count INT DEFAULT 0,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outbound cold call campaigns
CREATE TABLE outbound_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  total_calls INT DEFAULT 0,
  answered INT DEFAULT 0,
  interested INT DEFAULT 0,
  booked INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Per-contact call log within a campaign
CREATE TABLE outbound_call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES outbound_campaigns(id) ON DELETE CASCADE,
  contact_name TEXT,
  contact_phone TEXT NOT NULL,
  contact_company TEXT,
  contact_website TEXT,
  vapi_call_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'calling', 'answered', 'no_answer',
    'retry_scheduled', 'interested', 'not_interested', 'booked', 'failed'
  )),
  outcome TEXT,
  retry_count INT DEFAULT 0,
  retry_at TIMESTAMPTZ,
  collected_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC: atomically increment answered count on a campaign
CREATE OR REPLACE FUNCTION public.increment_campaign_answered(campaign_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.outbound_campaigns SET answered = answered + 1 WHERE id = campaign_id;
END;
$$;

-- RPC: atomically increment interested / booked counts
CREATE OR REPLACE FUNCTION public.increment_campaign_stat(campaign_id UUID, stat_col TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF stat_col = 'interested' THEN
    UPDATE public.outbound_campaigns SET interested = interested + 1 WHERE id = campaign_id;
  ELSIF stat_col = 'booked' THEN
    UPDATE public.outbound_campaigns SET booked = booked + 1 WHERE id = campaign_id;
  END IF;
END;
$$;

-- Row Level Security (service_role bypasses RLS; anon access blocked by default)
ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views             ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_availability     ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns        ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_campaigns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_call_logs     ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_submissions_created_at ON contact_submissions (created_at DESC);
CREATE INDEX idx_submissions_status ON contact_submissions (status);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX idx_page_views_page ON page_views (page);
CREATE INDEX idx_appointments_date ON appointments (scheduled_date, scheduled_time);
CREATE INDEX idx_outbound_campaigns_created ON outbound_campaigns (created_at DESC);
CREATE INDEX idx_outbound_logs_campaign ON outbound_call_logs (campaign_id);
CREATE INDEX idx_outbound_logs_vapi ON outbound_call_logs (vapi_call_id);
