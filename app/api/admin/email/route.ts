import type { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token || !(await verifyAdminToken(token))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.BREVO_API_KEY
  const fromEmail = process.env.BREVO_FROM_EMAIL
  const fromName = process.env.BREVO_FROM_NAME || 'Vertexa Solution'

  if (!apiKey || !fromEmail) {
    return Response.json({ error: 'Email not configured. Add BREVO_API_KEY and BREVO_FROM_EMAIL to environment variables.' }, { status: 503 })
  }

  const { to, toName, subject, body, attachment } = await request.json()
  if (!to || !subject || !body) {
    return Response.json({ error: 'to, subject and body are required' }, { status: 400 })
  }

  const htmlContent = body.replace(/\n/g, '<br/>')

  const payload: Record<string, unknown> = {
    sender: { name: fromName, email: fromEmail },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent,
  }

  if (attachment) {
    payload.attachment = [attachment]
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Brevo error:', err)
    return Response.json({ error: `Failed to send: ${err}` }, { status: 502 })
  }

  return Response.json({ success: true })
}
