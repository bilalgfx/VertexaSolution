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

  const payload: Record<string, unknown> = {
    page,
    per_page: 25,
    person_titles: title ? [title] : undefined,
    person_locations: location ? [location] : undefined,
    q_keywords: keyword || undefined,
  }

  if (industry) {
    payload.organization_industry_tag_values = [industry]
  }

  if (employeeRange) {
    const ranges: Record<string, string[]> = {
      '1-10': ['1,10'],
      '11-50': ['11,50'],
      '51-200': ['51,200'],
      '201-500': ['201,500'],
      '501-1000': ['501,1000'],
      '1001+': ['1001,10000'],
    }
    payload.organization_num_employees_ranges = ranges[employeeRange]
  }

  const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
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

  const results = (data.people || []).map((p: Record<string, unknown>) => {
    const org = p.organization as Record<string, unknown> | null
    const phones = p.phone_numbers as { raw_number: string }[] | null
    return {
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      title: p.title,
      email: p.email || null,
      email_status: p.email_status,
      linkedin_url: p.linkedin_url || null,
      phone: phones?.[0]?.raw_number || null,
      company: org?.name || null,
      industry: org?.industry || null,
      employees: org?.estimated_num_employees?.toString() || null,
      location: [p.city, p.state, p.country].filter(Boolean).join(', ') || null,
    }
  })

  return Response.json({
    results,
    total: data.pagination?.total_entries || results.length,
  })
}
