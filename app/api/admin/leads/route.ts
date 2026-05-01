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
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lead = await request.json()
  const db = getAdminClient()
  const { data, error } = await db.from('leads').insert(lead).select().single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { id: string; status?: 'new' | 'contacted' | 'email_sent' | 'qualified' | 'closed'; notes?: string | null }
  const { id, status, notes } = body
  if (!id) return Response.json({ error: 'ID required' }, { status: 400 })

  const patch: { status?: 'new' | 'contacted' | 'email_sent' | 'qualified' | 'closed'; notes?: string | null } = {}
  if (status !== undefined) patch.status = status
  if (notes !== undefined) patch.notes = notes

  const db = getAdminClient()
  const { error } = await db.from('leads').update(patch as never).eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()
  if (!id) return Response.json({ error: 'ID required' }, { status: 400 })

  const db = getAdminClient()
  const { error } = await db.from('leads').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
