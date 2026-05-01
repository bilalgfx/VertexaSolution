import type { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token || !(await verifyAdminToken(token))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.APOLLO_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Apollo API key not configured' }, { status: 503 })
  }

  const { industry, title, location, employeeRange, keyword, page = 1 } = await request.json()

  const searchTerms = [title, location, industry, keyword].filter(Boolean).join(' ')

  const payload: Record<string, unknown> = {
    page,
    per_page: 25,
    q_keywords: searchTerms || undefined,
  }

  const response = await fetch('https://api.apollo.io/v1/contacts/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': apiKey },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Apollo error:', response.status, err)
    return Response.json({ error: `Apollo error ${response.status}: ${err}` }, { status: 502 })
  }

  const data = await response.json()

  const results = (data.contacts || []).map((p: Record<string, unknown>) => {
    const org = p.organization as Record<string, unknown> | null
    const phones = p.phone_numbers as { raw_number: string }[] | null
    return {
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      title: p.title,
      email: (p.email as string) || null,
      email_status: p.email_true_status || p.email_status,
      linkedin_url: (p.linkedin_url as string) || null,
      phone: phones?.[0]?.raw_number || null,
      company: (p.organization_name as string) || (org?.name as string) || null,
      industry: (org?.industry as string) || null,
      employees: org?.estimated_num_employees?.toString() || null,
      location: [p.city, p.state, p.country].filter(Boolean).join(', ') || null,
    }
  })

  return Response.json({
    results,
    total: data.pagination?.total_entries ?? results.length,
  })
}
