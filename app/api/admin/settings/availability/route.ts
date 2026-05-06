import type { NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/auth'

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export async function GET(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminClient()
  const { data, error } = await db
    .from('admin_availability')
    .select('*')
    .order('day_of_week', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data ?? [])
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days: { day_of_week: number; start_time: string; end_time: string; is_active: boolean }[] =
    await request.json()

  if (!Array.isArray(days)) {
    return Response.json({ error: 'Expected array of availability objects' }, { status: 400 })
  }

  const db = getAdminClient()

  // Delete existing and re-insert (simplest upsert approach)
  await db.from('admin_availability').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error } = await db.from('admin_availability').insert(days)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
