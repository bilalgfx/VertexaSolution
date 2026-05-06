import type { NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/auth'

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export async function GET(request: NextRequest) {
  if (!(await isAuthed(request))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const campaignId = searchParams.get('campaignId')
  const db = getAdminClient()

  if (campaignId) {
    const [{ data: campaign }, { data: logs }] = await Promise.all([
      db.from('outbound_campaigns').select('*').eq('id', campaignId).single(),
      db.from('outbound_call_logs').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: true }),
    ])
    return Response.json({ campaign, logs: logs ?? [] })
  }

  const { data } = await db.from('outbound_campaigns').select('*').order('created_at', { ascending: false })
  return Response.json(data ?? [])
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, contacts } = await request.json()
  if (!name || !Array.isArray(contacts) || contacts.length === 0) {
    return Response.json({ error: 'name and contacts[] are required' }, { status: 400 })
  }

  const db = getAdminClient()
  const { data: campaign, error } = await db
    .from('outbound_campaigns')
    .insert({ name, total_calls: contacts.length })
    .select('id')
    .single()

  if (error || !campaign) return Response.json({ error: error?.message }, { status: 500 })

  const logs = contacts.map((c: { name?: string; phone: string; company?: string; website?: string }) => ({
    campaign_id: campaign.id,
    contact_name: c.name ?? null,
    contact_phone: c.phone,
    contact_company: c.company ?? null,
    contact_website: c.website ?? null,
    status: 'pending' as const,
  }))

  await db.from('outbound_call_logs').insert(logs)
  return Response.json({ id: campaign.id })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed(request))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, status } = await request.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const db = getAdminClient()
  const { error } = await db.from('outbound_campaigns').update({ status }).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
