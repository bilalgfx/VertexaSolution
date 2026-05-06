-- Migration: Call Agent, Appointments, Availability, Campaigns
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

-- 1. Add phone number to contact form submissions
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Admin weekly availability (used by AI call agent to check free slots)
CREATE TABLE IF NOT EXISTS admin_availability (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week  INTEGER NOT NULL,   -- 0=Sunday, 1=Monday ... 6=Saturday
  start_time   TIME    NOT NULL,
  end_time     TIME    NOT NULL,
  is_active    BOOLEAN DEFAULT true,
  CONSTRAINT chk_day CHECK (day_of_week BETWEEN 0 AND 6)
);

-- 3. Appointments booked by the AI call agent
CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id    UUID REFERENCES contact_submissions(id) ON DELETE SET NULL,
  contact_name     TEXT,
  contact_email    TEXT,
  contact_phone    TEXT,
  scheduled_date   DATE        NOT NULL,
  scheduled_time   TIME        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'confirmed',
  notes            TEXT,
  call_transcript  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_status CHECK (status IN ('confirmed', 'cancelled'))
);

-- 4. Bulk email campaign log
CREATE TABLE IF NOT EXISTS email_campaigns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject          TEXT        NOT NULL,
  body             TEXT        NOT NULL,
  recipient_count  INTEGER     NOT NULL DEFAULT 0,
  status           TEXT        NOT NULL DEFAULT 'sent',
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_status CHECK (status IN ('sent', 'failed'))
);

-- Seed default Mon-Fri 9am-5pm availability
INSERT INTO admin_availability (day_of_week, start_time, end_time, is_active)
VALUES
  (0, '09:00', '17:00', false),  -- Sunday (off)
  (1, '09:00', '17:00', true),   -- Monday
  (2, '09:00', '17:00', true),   -- Tuesday
  (3, '09:00', '17:00', true),   -- Wednesday
  (4, '09:00', '17:00', true),   -- Thursday
  (5, '09:00', '17:00', true),   -- Friday
  (6, '09:00', '17:00', false)   -- Saturday (off)
ON CONFLICT DO NOTHING;
