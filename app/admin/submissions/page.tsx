'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, Mail, Globe, DollarSign, Briefcase, Calendar, Send } from 'lucide-react'
import type { ContactSubmission } from '@/lib/types'
import EmailComposer from '@/app/components/admin/EmailComposer'

const STATUS_OPTIONS = ['new', 'contacted', 'closed'] as const
type Status = typeof STATUS_OPTIONS[number]

const statusStyles: Record<Status, string> = {
  new: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  contacted: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function buildDefaultBody(sub: ContactSubmission) {
  return `Hi ${sub.name.split(' ')[0]},

Thank you for reaching out to Vertexa Solution${sub.company ? ` on behalf of ${sub.company}` : ''}.

I've reviewed your inquiry${sub.service ? ` regarding ${sub.service}` : ''} and I'm excited to share how our AI automation solutions can help your business.

${sub.message ? `Regarding your message:\n"${sub.message}"\n\n` : ''}Please find our proposal attached. I'd love to schedule a quick call to walk you through everything.

Looking forward to working together.

Best regards,
Vertexa Solution Team`
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [composingSub, setComposingSub] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(r => r.json())
      .then(data => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.company || '').toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [submissions, search, filterStatus])

  const counts = useMemo(() => ({
    all: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    contacted: submissions.filter(s => s.status === 'contacted').length,
    closed: submissions.filter(s => s.status === 'closed').length,
  }), [submissions])

  const updateStatus = async (id: string, status: Status) => {
    setUpdatingId(id)
    const res = await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    setUpdatingId(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Submissions</h1>
          <p className="text-zinc-500 text-sm mt-1">{submissions.length} total contacts received</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="text" placeholder="Search by name, email, company..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111111] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all" />
        </div>
        <div className="flex gap-1 bg-[#111111] border border-white/8 rounded-xl p-1">
          {(['all', ...STATUS_OPTIONS] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filterStatus === s ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
              {s} ({counts[s] ?? counts.all})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-600 text-sm">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 text-sm">
            {submissions.length === 0
              ? 'No submissions yet. They appear here once visitors fill your contact form.'
              : 'No submissions match your filter.'}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(sub => (
              <div key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                <div className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}>
                  <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
                    {sub.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 grid sm:grid-cols-3 gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{sub.name}</div>
                      <div className="text-xs text-zinc-500 truncate">{sub.email}</div>
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <div className="text-sm text-zinc-300 truncate">{sub.company || '—'}</div>
                      <div className="text-xs text-zinc-500 truncate">{sub.service || '—'}</div>
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <div className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={11} />{formatDate(sub.created_at)}</div>
                      {sub.budget && <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><DollarSign size={11} />{sub.budget}</div>}
                    </div>
                  </div>
                  <div className="shrink-0" onClick={e => e.stopPropagation()}>
                    <select value={sub.status} disabled={updatingId === sub.id}
                      onChange={e => updateStatus(sub.id, e.target.value as Status)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer bg-transparent focus:outline-none ${statusStyles[sub.status]}`}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#1a1a1a] text-white capitalize">{s}</option>)}
                    </select>
                  </div>
                  <div className="shrink-0 text-zinc-600">
                    {expandedId === sub.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                {expandedId === sub.id && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="border-t border-white/5 pt-4 grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {sub.message && (
                          <div>
                            <div className="text-xs text-zinc-600 mb-1">Message</div>
                            <div className="text-sm text-zinc-300 bg-[#0d0d0d] rounded-xl p-3 leading-relaxed">{sub.message}</div>
                          </div>
                        )}
                        {/* Send Proposal Button */}
                        <button
                          onClick={e => { e.stopPropagation(); setComposingSub(sub) }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
                          <Send size={14} /> Send Proposal / Email
                        </button>
                      </div>
                      <div className="space-y-2">
                        {[
                          { icon: <Mail size={13} />, label: 'Email', value: sub.email, href: `mailto:${sub.email}` },
                          { icon: <Globe size={13} />, label: 'Website', value: sub.website, href: sub.website },
                          { icon: <Briefcase size={13} />, label: 'Service', value: sub.service },
                          { icon: <DollarSign size={13} />, label: 'Budget', value: sub.budget },
                        ].map(({ icon, label, value, href }) => value ? (
                          <div key={label} className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-600">{icon}</span>
                            <span className="text-zinc-500">{label}:</span>
                            {href ? (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 truncate">{value}</a>
                            ) : (
                              <span className="text-zinc-300">{value}</span>
                            )}
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <EmailComposer
        isOpen={!!composingSub}
        onClose={() => setComposingSub(null)}
        defaultTo={composingSub?.email ?? ''}
        defaultToName={composingSub?.name}
        defaultSubject={composingSub ? `Re: Your Inquiry${composingSub.service ? ` — ${composingSub.service}` : ''} | Vertexa Solution` : ''}
        defaultBody={composingSub ? buildDefaultBody(composingSub) : ''}
        showAttachment
      />
    </div>
  )
}
