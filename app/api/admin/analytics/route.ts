import type { NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token || !(await verifyAdminToken(token))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminClient()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const totalRes = await db.from('page_views').select('id', { count: 'exact', head: true })
  const todayRes = await db.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', todayStart)
  const weekRes = await db.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', weekStart)
  const pagesRes = await db.from('page_views').select('page').gte('created_at', monthStart)
  const daysRes = await db.from('page_views').select('created_at').gte('created_at', monthStart).order('created_at')
  const subsRes = await db.from('contact_submissions').select('id', { count: 'exact', head: true })
  const newSubsRes = await db.from('contact_submissions').select('id', { count: 'exact', head: true }).gte('created_at', weekStart)
  const leadsRes = await db.from('leads').select('id', { count: 'exact', head: true })

  // Aggregate views by day
  const viewsByDay: Record<string, number> = {}
  const daysData = (daysRes.data || []) as { created_at: string }[]
  for (const row of daysData) {
    const date = row.created_at.slice(0, 10)
    viewsByDay[date] = (viewsByDay[date] || 0) + 1
  }

  // Count top pages
  const pageCounts: Record<string, number> = {}
  const pagesData = (pagesRes.data || []) as { page: string }[]
  for (const row of pagesData) {
    if (row.page) pageCounts[row.page] = (pageCounts[row.page] || 0) + 1
  }

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([page, count]) => ({ page, count }))

  return Response.json({
    totalViews: totalRes.count ?? 0,
    todayViews: todayRes.count ?? 0,
    weekViews: weekRes.count ?? 0,
    topPages,
    viewsByDay: Object.entries(viewsByDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count })),
    totalSubmissions: subsRes.count ?? 0,
    newThisWeek: newSubsRes.count ?? 0,
    totalLeads: leadsRes.count ?? 0,
  })
}
