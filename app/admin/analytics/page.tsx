'use client'

import { useState, useEffect } from 'react'
import { Eye, TrendingUp, BarChart3, Globe } from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  todayViews: number
  weekViews: number
  topPages: { page: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
}

function formatPage(page: string) {
  if (page === '/') return 'Home'
  return page.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const maxCount = data ? Math.max(...data.viewsByDay.map(d => d.count), 1) : 1
  const maxPageCount = data ? Math.max(...data.topPages.map(p => p.count), 1) : 1

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-500 text-sm mt-1">Your website traffic — last 30 days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Page Views', value: data?.totalViews, icon: <Eye size={18} className="text-emerald-400" />, color: 'border-emerald-500/20' },
          { label: 'Views Today', value: data?.todayViews, icon: <TrendingUp size={18} className="text-cyan-400" />, color: 'border-cyan-500/20' },
          { label: 'Views This Week', value: data?.weekViews, icon: <BarChart3 size={18} className="text-violet-400" />, color: 'border-violet-500/20' },
        ].map(card => (
          <div key={card.label} className={`bg-[#111111] border ${card.color} rounded-2xl p-5`}>
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">
              {loading ? <span className="text-zinc-600">...</span> : (card.value ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Views by Day Chart */}
        <div className="lg:col-span-3 bg-[#111111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={15} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Daily Views — Last 30 Days</h2>
          </div>

          {loading ? (
            <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
          ) : !data || data.viewsByDay.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-zinc-600 text-sm">
              <Globe size={24} className="mb-2 opacity-40" />
              No data yet. Views will appear once visitors come to your site.
            </div>
          ) : (
            <div className="space-y-1">
              {/* Bar chart */}
              <div className="flex items-end gap-0.5 h-40">
                {data.viewsByDay.map(({ date, count }) => (
                  <div
                    key={date}
                    className="flex-1 bg-violet-500/40 hover:bg-violet-500/60 rounded-t transition-colors cursor-default group relative"
                    style={{ height: `${Math.max((count / maxCount) * 100, 4)}%` }}
                  >
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                      {count} views<br />
                      <span className="text-zinc-500">{formatDate(date)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* X axis labels */}
              <div className="flex gap-0.5 text-[9px] text-zinc-600 overflow-hidden">
                {data.viewsByDay.map(({ date }, i) => (
                  <div key={date} className="flex-1 text-center truncate">
                    {i % 5 === 0 ? formatDate(date) : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Pages */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={15} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Top Pages</h2>
          </div>

          {loading ? (
            <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
          ) : !data || data.topPages.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">
              No page data yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.topPages.map(({ page, count }) => (
                <div key={page}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-300 truncate">{formatPage(page)}</span>
                    <span className="text-xs text-zinc-500 ml-2 shrink-0">{count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${(count / maxPageCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-600">
        Analytics are tracked automatically for all public pages. Data starts accumulating once you deploy and visitors arrive.
      </div>
    </div>
  )
}
