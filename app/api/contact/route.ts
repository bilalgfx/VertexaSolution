import { getAdminClient } from '@/lib/supabase'
import { triggerVapiCall } from '@/lib/vapi'
import { Resend } from 'resend'

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

    // Send email notification to admin
    if (process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.RESEND_TO_EMAIL,
        subject: `New submission from ${name} — ${company || email}`,
        html: `
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
      })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
