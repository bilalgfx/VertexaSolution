'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Inbox, Users, Eye, TrendingUp, ArrowRight, Clock } from 'lucide-react'
import type { ContactSubmission } from '@/lib/types'

interface Stats {
  totalSubmissions: number
  newThisWeek: number
  totalLeads: number
  todayViews: number
  weekViews: number
}

const statusColors: Record<string, string> = {
  new: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  contacted: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/analytics').then(r => r.json()),
      fetch('/api/admin/submissions').then(r => r.json()),
    ]).then(([analytics, submissions]) => {
      setStats({
        totalSubmissions: analytics.totalSubmissions || 0,
        newThisWeek: analytics.newThisWeek || 0,
        totalLeads: analytics.totalLeads || 0,
        todayViews: analytics.todayViews || 0,
        weekViews: analytics.weekViews || 0,
      })
      setRecent(Array.isArray(submissions) ? submissions.slice(0, 6) : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const cards = [
    {
      label: 'Total Submissions',
      value: stats?.totalSubmissions ?? '—',
      sub: `${stats?.newThisWeek ?? 0} new this week`,
      icon: <Inbox size={18} className="text-violet-400" />,
      href: '/admin/submissions',
      color: 'border-violet-500/20 hover:border-violet-500/40',
    },
    {
      label: 'Saved Leads',
      value: stats?.totalLeads ?? '—',
      sub: 'From Apollo + manual',
      icon: <Users size={18} className="text-cyan-400" />,
      href: '/admin/leads',
      color: 'border-cyan-500/20 hover:border-cyan-500/40',
    },
    {
      label: 'Views Today',
      value: stats?.todayViews ?? '—',
      sub: `${stats?.weekViews ?? 0} this week`,
      icon: <Eye size={18} className="text-emerald-400" />,
      href: '/admin/analytics',
      color: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
    {
      label: 'New This Week',
      value: stats?.newThisWeek ?? '—',
      sub: 'Inbound leads',
      icon: <TrendingUp size={18} className="text-amber-400" />,
      href: '/admin/submissions',
      color: 'border-amber-500/20 hover:border-amber-500/40',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <Link
            key={card.label}
            href={card.href}
            className={`bg-[#111111] border ${card.color} rounded-2xl p-5 transition-all hover:bg-[#161616] group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                {card.icon}
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">
              {loading ? <span className="text-zinc-600">...</span> : card.value}
            </div>
            <div className="text-xs text-zinc-500">{card.label}</div>
            <div className="text-xs text-zinc-600 mt-1">{card.sub}</div>
          </Link>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white text-sm">Recent Submissions</h2>
          <Link
            href="/admin/submissions"
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-600 text-sm">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">
            No submissions yet. They&apos;ll appear here when visitors fill your contact form.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map(sub => (
              <div key={sub.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
                  {sub.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{sub.name}</span>
                    {sub.company && (
                      <span className="text-xs text-zinc-500 truncate hidden sm:block">— {sub.company}</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">{sub.email}</div>
                </div>
                <div className="shrink-0 hidden md:flex items-center gap-1.5 text-xs text-zinc-600">
                  <Clock size={11} />
                  {timeAgo(sub.created_at)}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[sub.status]}`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {[
          { label: 'Search new leads', sub: 'Apollo prospecting', href: '/admin/leads', color: 'text-cyan-400' },
          { label: 'View analytics', sub: 'Traffic & page stats', href: '/admin/analytics', color: 'text-emerald-400' },
          { label: 'All submissions', sub: 'Manage your inbox', href: '/admin/submissions', color: 'text-violet-400' },
        ].map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="bg-[#111111] border border-white/5 hover:border-white/10 rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:bg-[#161616] group"
          >
            <div>
              <div className={`text-sm font-medium ${a.color}`}>{a.label}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{a.sub}</div>
            </div>
            <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
