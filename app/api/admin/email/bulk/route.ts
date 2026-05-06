import type { NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/auth'

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  return verifyAdminToken(token)
}

function applyVars(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.BREVO_API_KEY
  const fromEmail = process.env.BREVO_FROM_EMAIL
  const fromName = process.env.BREVO_FROM_NAME || 'Vertexa Solution'

  if (!apiKey || !fromEmail) {
    return Response.json({ error: 'Brevo not configured' }, { status: 503 })
  }

  const { recipient_ids, source, subject, body } = await request.json()
  if (!Array.isArray(recipient_ids) || !subject || !body) {
    return Response.json({ error: 'recipient_ids, subject and body are required' }, { status: 400 })
  }

  const db = getAdminClient()

  // Fetch recipients
  type Recipient = { id: string; name: string; email: string; company: string | null }
  let recipients: Recipient[] = []

  if (source === 'leads') {
    const { data } = await db
      .from('leads')
      .select('id, first_name, last_name, email, company')
      .in('id', recipient_ids)
    recipients = (data ?? [])
      .filter((r) => r.email)
      .map((r) => ({
        id: r.id,
        name: `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim() || 'there',
        email: r.email!,
        company: r.company,
      }))
  } else {
    const { data } = await db
      .from('contact_submissions')
      .select('id, name, email, company')
      .in('id', recipient_ids)
    recipients = (data ?? [])
      .filter((r) => r.email)
      .map((r) => ({ id: r.id, name: r.name, email: r.email, company: r.company }))
  }

  let sent = 0
  let failed = 0

  for (const r of recipients) {
    const vars = { name: r.name, company: r.company ?? '' }
    const personalizedSubject = applyVars(subject, vars)
    const personalizedBody = applyVars(body, vars)
    const htmlContent = personalizedBody.replace(/\n/g, '<br/>')

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: r.email, name: r.name }],
        subject: personalizedSubject,
        htmlContent,
      }),
    })

    if (res.ok) sent++
    else failed++
  }

  // Log campaign
  await db.from('email_campaigns').insert({
    subject,
    body,
    recipient_count: sent,
    status: failed === recipients.length ? 'failed' : 'sent',
  })

  return Response.json({ sent, failed, total: recipients.length })
}
