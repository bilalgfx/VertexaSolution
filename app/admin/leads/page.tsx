'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Trash2, ExternalLink, Mail, Building2, MapPin, Users, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Lead, ApolloResult } from '@/lib/types'

const INDUSTRIES = [
  'Ecommerce', 'Retail', 'Fashion & Apparel', 'Health & Wellness', 'Beauty & Cosmetics',
  'Electronics', 'Home & Garden', 'Sports & Outdoors', 'Food & Beverage', 'Software',
  'Marketing & Advertising', 'Consulting', 'Financial Services',
]
const EMPLOYEE_RANGES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+']
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const
type LeadStatus = typeof LEAD_STATUSES[number]

const leadStatusStyles: Record<LeadStatus, string> = {
  new: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  contacted: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  qualified: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
}

export default function Leads() {
  const [savedLeads, setSavedLeads] = useState<Lead[]>([])
  const [results, setResults] = useState<ApolloResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchDone, setSearchDone] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [hasApolloKey, setHasApolloKey] = useState(true)
  const [searchError, setSearchError] = useState('')

  const [filters, setFilters] = useState({
    industry: '',
    title: '',
    location: '',
    employeeRange: '',
    keyword: '',
  })

  useEffect(() => {
    fetch('/api/admin/leads')
      .then(r => r.json())
      .then(data => setSavedLeads(Array.isArray(data) ? data : []))
  }, [])

  const search = async () => {
    setLoading(true)
    setSearchError('')
    setSearchDone(false)

    const res = await fetch('/api/admin/leads/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.error?.includes('API key')) setHasApolloKey(false)
      setSearchError(data.error || 'Search failed')
    } else {
      setResults(data.results || [])
      setHasApolloKey(true)
    }

    setSearchDone(true)
    setLoading(false)
  }

  const saveLead = async (result: ApolloResult) => {
    setSavingId(result.id as string)
    const lead = {
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      company: result.organization?.name || null,
      title: result.title,
      linkedin_url: result.linkedin_url,
      phone: result.phone_numbers?.[0]?.raw_number || null,
      industry: result.organization?.industry || null,
      employees: result.organization?.estimated_num_employees?.toString() || null,
      location: [result.city, result.state, result.country].filter(Boolean).join(', ') || null,
      source: 'apollo',
    }

    const res = await fetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })

    if (res.ok) {
      const saved = await res.json()
      setSavedLeads(prev => [saved, ...prev])
      setSavedIds(prev => new Set([...prev, result.id as string]))
    }

    setSavingId(null)
  }

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setSavedLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const deleteLead = async (id: string) => {
    setDeletingId(id)
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSavedLeads(prev => prev.filter(l => l.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Lead Generation</h1>
        <p className="text-zinc-500 text-sm mt-1">Search and save leads via Apollo.io</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Search Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-5">
              <Search size={15} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Apollo Search</h2>
            </div>

            {!hasApolloKey && (
              <div className="mb-4 flex items-start gap-2 px-3 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                Add your <code className="mx-0.5 bg-amber-500/20 px-1 rounded">APOLLO_API_KEY</code> to <code className="mx-0.5 bg-amber-500/20 px-1 rounded">.env.local</code> to enable search.
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Industry</label>
                <select
                  value={filters.industry}
                  onChange={e => setFilters(f => ({ ...f, industry: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all"
                >
                  <option value="">Any industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Founder, Head of Marketing"
                  value={filters.title}
                  onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="e.g. United States, London"
                  value={filters.location}
                  onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Company Size</label>
                <select
                  value={filters.employeeRange}
                  onChange={e => setFilters(f => ({ ...f, employeeRange: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all"
                >
                  <option value="">Any size</option>
                  {EMPLOYEE_RANGES.map(r => <option key={r} value={r}>{r} employees</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. shopify, ecommerce, DTC"
                  value={filters.keyword}
                  onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                />
              </div>

              <button
                onClick={search}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Search size={14} />
                {loading ? 'Searching...' : 'Search Leads'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {!searchDone && !loading && (
            <div className="h-48 flex flex-col items-center justify-center text-center text-zinc-600 border border-dashed border-white/8 rounded-2xl">
              <Search size={28} className="mb-3 opacity-40" />
              <p className="text-sm">Set your filters and click Search Leads</p>
              <p className="text-xs mt-1 text-zinc-700">Results from Apollo.io will appear here</p>
            </div>
          )}

          {searchError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              {searchError}
            </div>
          )}

          {searchDone && !loading && results.length === 0 && !searchError && (
            <div className="h-48 flex items-center justify-center text-zinc-600 text-sm border border-white/5 rounded-2xl">
              No results found. Try adjusting your filters.
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-zinc-500 mb-3">{results.length} results</div>
              {results.map(r => {
                const alreadySaved = savedIds.has(r.id as string) || savedLeads.some(l => l.linkedin_url === r.linkedin_url && r.linkedin_url)
                return (
                  <div key={r.id as string} className="bg-[#111111] border border-white/5 rounded-xl p-4 flex items-start gap-3 hover:border-white/10 transition-all">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                      {(r.first_name || '?').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {r.first_name} {r.last_name}
                          </div>
                          {r.title && <div className="text-xs text-zinc-400">{r.title}</div>}
                        </div>
                        <button
                          onClick={() => !alreadySaved && saveLead(r)}
                          disabled={alreadySaved || savingId === r.id}
                          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            alreadySaved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          }`}
                        >
                          {alreadySaved ? (
                            <><CheckCircle2 size={12} /> Saved</>
                          ) : (
                            <><Plus size={12} /> {savingId === r.id ? 'Saving...' : 'Save'}</>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {r.organization?.name && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Building2 size={11} /> {r.organization.name}
                          </span>
                        )}
                        {(r.city || r.country) && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <MapPin size={11} /> {[r.city, r.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                        {r.email && (
                          <span className="flex items-center gap-1 text-xs text-zinc-400">
                            <Mail size={11} /> {r.email}
                          </span>
                        )}
                        {r.linkedin_url && (
                          <a href={r.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400">
                            <ExternalLink size={11} /> LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Saved Leads Table */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Saved Leads</h2>
          <span className="text-xs text-zinc-500">{savedLeads.length} total</span>
        </div>

        {savedLeads.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">
            No leads saved yet. Search above and click Save to add leads here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Company', 'Title', 'Location', 'Email', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-zinc-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {savedLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3 text-white font-medium">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-zinc-600" />
                        <span className="text-zinc-300">{lead.company || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Briefcase size={11} className="text-zinc-600" />
                        {lead.title || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-zinc-500 flex items-center gap-1 text-xs">
                        <MapPin size={11} />
                        {lead.location || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="text-violet-400 hover:text-violet-300 text-xs transition-colors">
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-zinc-600 text-xs flex items-center gap-1">
                          <Users size={11} /> No email
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer bg-transparent focus:outline-none ${leadStatusStyles[lead.status]}`}
                      >
                        {LEAD_STATUSES.map(s => (
                          <option key={s} value={s} className="bg-[#1a1a1a] text-white capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {lead.linkedin_url && (
                          <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => deleteLead(lead.id)}
                          disabled={deletingId === lead.id}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
