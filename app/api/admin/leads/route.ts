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

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''

  const db = getAdminClient()
  let query = db.from('leads').select('*').order('created_at', { ascending: false })

  if (status) query = query.eq('status', status as 'new' | 'contacted' | 'qualified' | 'closed')
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leads = await request.json()
  if (!Array.isArray(leads) || leads.length === 0) {
    return Response.json({ error: 'Expected array of leads' }, { status: 400 })
  }

  const db = getAdminClient()
  const { data, error } = await db.from('leads').insert(leads).select('id')
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ inserted: data?.length ?? 0 })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, ...updates } = await request.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const db = getAdminClient()
  const { error } = await db.from('leads').update(updates).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const db = getAdminClient()

  // Bulk delete
  if (Array.isArray(body.ids) && body.ids.length > 0) {
    const { error } = await db.from('leads').delete().in('id', body.ids)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ deleted: body.ids.length })
  }

  // Single delete
  if (!body.id) return Response.json({ error: 'id or ids required' }, { status: 400 })
  const { error } = await db.from('leads').delete().eq('id', body.id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
