import { getAdminClient } from '@/lib/supabase'
import { triggerVapiCall } from '@/lib/vapi'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, website, service, budget, message } = body

    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const db = getAdminClient()
    const { data: inserted, error } = await db.from('contact_submissions').insert({
      name, email, phone: phone || null, company, website, service, budget, message,
    }).select('id').single()

    if (error) throw error

    // Fire VAPI call if phone provided (non-blocking)
    if (inserted?.id && phone) {
      triggerVapiCall(inserted.id, phone, name).catch((err) =>
        console.error('VAPI call trigger failed:', err)
      )
    }

    // Send admin notification via Brevo
    const brevoKey = process.env.BREVO_API_KEY
    const fromEmail = process.env.BREVO_FROM_EMAIL
    const toEmail = process.env.BREVO_ADMIN_EMAIL
    if (brevoKey && fromEmail && toEmail) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
        body: JSON.stringify({
          sender: { name: process.env.BREVO_FROM_NAME || 'Vertexa Solution', email: fromEmail },
          to: [{ email: toEmail }],
          subject: `New submission from ${name} — ${company || email}`,
          htmlContent: `
            <h2>New Contact Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || '—'}</p>
            <p><strong>Company:</strong> ${company || '—'}</p>
            <p><strong>Website:</strong> ${website || '—'}</p>
            <p><strong>Service:</strong> ${service || '—'}</p>
            <p><strong>Budget:</strong> ${budget || '—'}</p>
            <p><strong>Message:</strong><br/>${message || '—'}</p>
          `,
        }),
      }).catch((err) => console.error('Brevo notification failed:', err))
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
