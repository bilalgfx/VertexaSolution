import type { NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token || !(await verifyAdminToken(token))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { leads } = await request.json()
  if (!Array.isArray(leads) || leads.length === 0) {
    return Response.json({ error: 'No leads provided' }, { status: 400 })
  }

  const rows = leads.map((l: Record<string, string | null>) => ({
    first_name: l.first_name || null,
    last_name: l.last_name || null,
    email: l.email || null,
    company: l.company || null,
    title: l.title || null,
    phone: l.phone || null,
    industry: l.industry || null,
    location: l.location || null,
    linkedin_url: l.linkedin_url || null,
    facebook_url: l.facebook_url || null,
    instagram_url: l.instagram_url || null,
    twitter_url: l.twitter_url || null,
    website: l.website || null,
    source: 'csv',
    status: 'new',
  }))

  const db = getAdminClient()
  const { data, error } = await db.from('leads').insert(rows).select()
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ imported: data.length })
}
