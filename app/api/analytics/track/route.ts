import { getAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { page, referrer } = await request.json()
    if (!page) return Response.json({ ok: false })

    const db = getAdminClient()
    await db.from('page_views').insert({ page, referrer: referrer || null })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false })
  }
}
