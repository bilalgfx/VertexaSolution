import type { NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/auth'

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.VAPI_API_KEY
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID
  const assistantId = process.env.VAPI_COLD_CALL_ASSISTANT_ID ?? process.env.VAPI_ASSISTANT_ID

  if (!apiKey || !phoneNumberId || !assistantId) {
    return Response.json({ error: 'VAPI not configured' }, { status: 503 })
  }

  const { campaignId } = await request.json()
  if (!campaignId) return Response.json({ error: 'campaignId required' }, { status: 400 })

  const db = getAdminClient()

  // Get pending + retry-eligible calls
  const now = new Date().toISOString()
  const { data: pending } = await db
    .from('outbound_call_logs')
    .select('*')
    .eq('campaign_id', campaignId)
    .or(`status.eq.pending,and(status.eq.retry_scheduled,retry_at.lte.${now})`)

  if (!pending || pending.length === 0) {
    return Response.json({ message: 'No pending calls', fired: 0 })
  }

  let fired = 0
  let failed = 0

  for (const log of pending) {
    const res = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        phoneNumberId,
        assistantId,
        customer: {
          number: log.contact_phone,
          name: log.contact_name ?? 'there',
        },
        assistantOverrides: {
          variableValues: {
            customerName: log.contact_name ?? 'there',
            businessName: log.contact_company ?? '',
            industry: log.contact_industry ?? '',
            callLogId: log.id,
            campaignId,
          },
        },
      }),
    })

    if (res.ok) {
      const call = await res.json()
      await db.from('outbound_call_logs').update({ status: 'calling', vapi_call_id: call.id }).eq('id', log.id)
      fired++
    } else {
      await db.from('outbound_call_logs').update({ status: 'failed' }).eq('id', log.id)
      failed++
    }

    // Small delay between calls to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  // Update campaign status to running
  await db.from('outbound_campaigns').update({ status: 'running' }).eq('id', campaignId)

  return Response.json({ fired, failed, total: pending.length })
}
