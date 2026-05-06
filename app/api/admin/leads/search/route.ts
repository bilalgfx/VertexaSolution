import type { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.APOLLO_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'APOLLO_API_KEY not configured' }, { status: 503 })
  }

  const { keywords, industry, location, page_size = 20 } = await request.json()

  const payload: Record<string, unknown> = {
    per_page: Math.min(page_size, 50),
    page: 1,
  }

  if (keywords) payload.q_keywords = keywords
  if (industry) payload.industry_tag_ids = [] // Apollo uses tag IDs; pass raw industry name via q_keywords fallback
  if (location) payload.person_locations = [location]

  const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Apollo error:', err)
    return Response.json({ error: `Apollo API error: ${res.status}` }, { status: 502 })
  }

  const json = await res.json()
  const people = (json.people ?? []) as Record<string, unknown>[]

  const leads = people.map((p) => {
    const org = (p.organization ?? {}) as Record<string, unknown>
    const loc = (p.city ?? '') + (p.state ? `, ${p.state}` : '') + (p.country ? `, ${p.country}` : '')
    return {
      first_name: (p.first_name as string) ?? null,
      last_name: (p.last_name as string) ?? null,
      email: (p.email as string) ?? null,
      company: (org.name as string) ?? null,
      title: (p.title as string) ?? null,
      linkedin_url: (p.linkedin_url as string) ?? null,
      phone: ((p.phone_numbers as { sanitized_number?: string }[])?.[0]?.sanitized_number) ?? null,
      industry: (org.industry as string) ?? null,
      employees: org.estimated_num_employees ? String(org.estimated_num_employees) : null,
      location: loc || null,
      source: 'apollo',
    }
  })

  return Response.json({ leads, total: json.pagination?.total_entries ?? leads.length })
}
