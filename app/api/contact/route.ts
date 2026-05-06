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

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
