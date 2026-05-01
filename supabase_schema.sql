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

-- Indexes for performance
CREATE INDEX idx_submissions_created_at ON contact_submissions (created_at DESC);
CREATE INDEX idx_submissions_status ON contact_submissions (status);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX idx_page_views_page ON page_views (page);
