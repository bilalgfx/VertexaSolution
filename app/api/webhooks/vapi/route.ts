import { getAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const secret = process.env.VAPI_WEBHOOK_SECRET
  if (secret && request.headers.get('x-vapi-secret') !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()
  const message = body.message

  // Handle end-of-call report — update outbound call log status
  if (message?.type === 'end-of-call-report') {
    const callId = body.call?.id
    const endedReason = body.endedReason ?? ''
    if (callId) {
      const db = getAdminClient()
      const noAnswer = ['no-answer', 'busy', 'failed', 'call.start.error'].some(r => endedReason.includes(r))
      const status = noAnswer ? 'no_answer' : 'answered'
      const retryAt = noAnswer ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null

      const { data: log } = await db
        .from('outbound_call_logs')
        .select('id, retry_count, campaign_id')
        .eq('vapi_call_id', callId)
        .single()

      if (log) {
        const newStatus = noAnswer && (log.retry_count ?? 0) < 1 ? 'retry_scheduled' : status
        await db.from('outbound_call_logs').update({
          status: newStatus,
          retry_count: (log.retry_count ?? 0) + (noAnswer ? 1 : 0),
          ...(retryAt && newStatus === 'retry_scheduled' ? { retry_at: retryAt } : {}),
        }).eq('id', log.id)

        // Update campaign answered count
        if (!noAnswer && log.campaign_id) {
          await db.rpc('increment_campaign_answered', { campaign_id: log.campaign_id })
        }
      }
    }
    return Response.json({ ok: true })
  }

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

    if (fn.name === 'save_lead_interest') {
      const { call_log_id, email, interest_level, notes } = args
      const db2 = getAdminClient()
      const status = (interest_level === 'hot' ? 'interested' : 'answered') as 'interested' | 'answered'
      const updates: { status: 'interested' | 'answered'; outcome: string; collected_email?: string; notes?: string } = {
        status,
        outcome: interest_level,
        ...(email ? { collected_email: email } : {}),
        ...(notes ? { notes } : {}),
      }
      if (call_log_id) {
        await db2.from('outbound_call_logs').update(updates).eq('id', call_log_id)
      }
      results.push({
        toolCallId,
        result: email
          ? `Saved interest level (${interest_level}) and email. We will follow up at ${email}.`
          : `Saved interest level: ${interest_level}.`,
      })
      continue
    }

    results.push({ toolCallId, result: 'Unknown function.' })
  }

  return Response.json({ results })
}
