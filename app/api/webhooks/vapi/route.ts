import { getAdminClient } from '@/lib/supabase'

// VAPI sends POST here when the assistant calls a tool function
export async function POST(request: Request) {
  const body = await request.json()

  // VAPI wraps tool calls in a message with type "tool-calls"
  const message = body.message
  if (!message || message.type !== 'tool-calls') {
    return Response.json({ results: [] })
  }

  const db = getAdminClient()
  const results: { toolCallId: string; result: string }[] = []

  for (const toolCall of message.toolCallList ?? []) {
    const { id: toolCallId, function: fn } = toolCall
    const args = fn.arguments ?? {}

    if (fn.name === 'update_submission') {
      const { submission_id, field, new_value } = args
      const allowed = ['service', 'budget', 'message', 'company', 'website']
      if (!submission_id || !field || !allowed.includes(field)) {
        results.push({ toolCallId, result: 'Invalid field or submission ID.' })
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: any = { [field]: new_value }
      const { error } = await db
        .from('contact_submissions')
        .update(updatePayload)
        .eq('id', submission_id)
      results.push({
        toolCallId,
        result: error ? `Update failed: ${error.message}` : `Updated ${field} successfully.`,
      })
      continue
    }

    if (fn.name === 'check_availability') {
      const { date, time } = args
      if (!date || !time) {
        results.push({ toolCallId, result: JSON.stringify({ available: false, reason: 'Missing date or time.' }) })
        continue
      }

      // Parse day of week from date string (YYYY-MM-DD)
      const dayOfWeek = new Date(date).getDay()

      const { data: avail } = await db
        .from('admin_availability')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .single()

      if (!avail) {
        results.push({ toolCallId, result: JSON.stringify({ available: false, reason: 'Not available that day.' }) })
        continue
      }

      // Check time is within working hours
      if (time < avail.start_time || time >= avail.end_time) {
        results.push({
          toolCallId,
          result: JSON.stringify({
            available: false,
            reason: `Working hours are ${avail.start_time} to ${avail.end_time}.`,
          }),
        })
        continue
      }

      // Check no conflicting appointment
      const { data: conflict } = await db
        .from('appointments')
        .select('id')
        .eq('scheduled_date', date)
        .eq('scheduled_time', time)
        .eq('status', 'confirmed')
        .single()

      results.push({
        toolCallId,
        result: JSON.stringify({ available: !conflict }),
      })
      continue
    }

    if (fn.name === 'book_appointment') {
      const { submission_id, date, time } = args
      if (!date || !time) {
        results.push({ toolCallId, result: 'Missing date or time.' })
        continue
      }

      // Fetch contact details from submission
      let contactName: string | null = null
      let contactEmail: string | null = null
      let contactPhone: string | null = null

      if (submission_id) {
        const { data: sub } = await db
          .from('contact_submissions')
          .select('name, email, phone')
          .eq('id', submission_id)
          .single()
        if (sub) {
          contactName = sub.name
          contactEmail = sub.email
          contactPhone = sub.phone
        }
      }

      const { error } = await db.from('appointments').insert({
        submission_id: submission_id || null,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        scheduled_date: date,
        scheduled_time: time,
        status: 'confirmed',
      })

      results.push({
        toolCallId,
        result: error
          ? `Booking failed: ${error.message}`
          : `Appointment confirmed for ${date} at ${time}.`,
      })
      continue
    }

    results.push({ toolCallId, result: 'Unknown function.' })
  }

  return Response.json({ results })
}
