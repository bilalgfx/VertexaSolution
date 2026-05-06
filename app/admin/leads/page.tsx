'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Users, Plus, Trash2, Download, ExternalLink, Link2, X } from 'lucide-react'

type Lead = {
  id?: string
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  title: string | null
  linkedin_url: string | null
  phone: string | null
  industry: string | null
  employees: string | null
  location: string | null
  status?: 'new' | 'contacted' | 'qualified' | 'closed'
  source?: string
  created_at?: string
}

const STATUS_COLORS = {
  new: 'bg-violet-500/10 text-violet-400',
  contacted: 'bg-blue-500/10 text-blue-400',
  qualified: 'bg-green-500/10 text-green-400',
  closed: 'bg-zinc-500/10 text-zinc-400',
}

const BLANK: Omit<Lead, 'id' | 'status' | 'source' | 'created_at'> = {
  first_name: '', last_name: '', email: '', phone: '',
  company: '', title: '', linkedin_url: '', industry: '', employees: '', location: '',
}

export default function LeadsPage() {
  const [tab, setTab] = useState<'search' | 'saved'>('search')

  // Search state
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<Lead[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [searchError, setSearchError] = useState('')
  const [saving, setSaving] = useState(false)

  // Saved leads state
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [searchLeads, setSearchLeads] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Multi-select delete
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  // Manual add modal
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ ...BLANK })
  const [addSaving, setAddSaving] = useState(false)

  const doSearch = async () => {
    setSearching(true)
    setSearchError('')
    setSelected(new Set())
    const res = await fetch('/api/admin/leads/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, location, page_size: pageSize }),
    })
    if (res.ok) {
      const data = await res.json()
      setResults(data.leads ?? [])
    } else {
      const err = await res.json()
      setSearchError(err.error ?? 'Search failed')
    }
    setSearching(false)
  }

  const toggleSelect = (i: number) => {
    setSelected((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }

  const toggleAll = () => {
    setSelected((prev) => (prev.size === results.length ? new Set() : new Set(results.map((_, i) => i))))
  }

  const saveSelected = async () => {
    const toSave = Array.from(selected).map((i) => ({ ...results[i], status: 'new' as const, source: 'apollo' }))
    setSaving(true)
    const res = await fetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSave),
    })
    setSaving(false)
    if (res.ok) { setSelected(new Set()); setTab('saved'); fetchLeads() }
  }

  const fetchLeads = async () => {
    setLoadingLeads(true)
    const params = new URLSearchParams()
    if (searchLeads) params.set('search', searchLeads)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/leads?${params}`)
    if (res.ok) setLeads(await res.json())
    setLoadingLeads(false)
  }

  useEffect(() => { fetchLeads() }, [searchLeads, statusFilter])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: status as Lead['status'] } : l)))
  }

  const deleteLead = async (id: string) => {
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLeads((prev) => prev.filter((l) => l.id !== id))
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n })
  }

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return
    setDeleting(true)
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    })
    setLeads((prev) => prev.filter((l) => !selectedIds.has(l.id!)))
    setSelectedIds(new Set())
    setDeleting(false)
  }

  const toggleLeadId = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const toggleAllLeads = () => {
    const allIds = leads.map((l) => l.id!)
    setSelectedIds((prev) => prev.size === leads.length ? new Set() : new Set(allIds))
  }

  const addManual = async () => {
    const payload = {
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      title: form.title || null,
      linkedin_url: form.linkedin_url || null,
      industry: form.industry || null,
      location: form.location || null,
      status: 'new' as const,
      source: 'manual',
    }
    setAddSaving(true)
    const res = await fetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([payload]),
    })
    setAddSaving(false)
    if (res.ok) {
      setShowAdd(false)
      setForm({ ...BLANK })
      setTab('saved')
      fetchLeads()
    }
  }

  const exportCsv = () => {
    const header = 'Name,Email,Phone,Company,Title,Industry,Location,LinkedIn,Status'
    const rows = leads.map((l) =>
      [`${l.first_name ?? ''} ${l.last_name ?? ''}`.trim(), l.email ?? '', l.phone ?? '',
        l.company ?? '', l.title ?? '', l.industry ?? '', l.location ?? '', l.linkedin_url ?? '', l.status ?? '']
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const nameOf = (l: Lead) => `${l.first_name ?? ''} ${l.last_name ?? ''}`.trim() || '—'

  const field = (key: keyof typeof BLANK, placeholder: string, label: string) => (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <input
        value={(form[key] as string) ?? ''}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
      />
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Lead Generation</h1>
        <p className="text-zinc-500 text-sm">Search Apollo.io for contacts and manage your saved leads</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#111111] border border-white/5 w-fit mb-8">
        {(['search', 'saved'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
            {t === 'saved' ? `Saved Leads (${leads.length})` : 'Search & Import'}
          </button>
        ))}
      </div>

      {/* ── Search tab ── */}
      {tab === 'search' && (
        <div>
          <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 mb-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-500 mb-1.5">Keywords</label>
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  placeholder="e.g. ecommerce manager, shopify store owner"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-xs text-zinc-500">Results:</label>
                {[10, 20, 50].map((n) => (
                  <button key={n} onClick={() => setPageSize(n)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${pageSize === n ? 'bg-violet-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>
                    {n}
                  </button>
                ))}
              </div>
              <button onClick={doSearch} disabled={searching || !keywords}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-medium text-sm transition-all">
                <Search size={14} />
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {searchError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{searchError}</div>
          )}

          {results.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selected.size === results.length} onChange={toggleAll} className="w-4 h-4 accent-violet-500" />
                  <span className="text-sm text-zinc-400">{selected.size} of {results.length} selected</span>
                </div>
                {selected.size > 0 && (
                  <button onClick={saveSelected} disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-medium transition-all">
                    <Plus size={14} />
                    {saving ? 'Saving...' : `Save ${selected.size} Lead${selected.size > 1 ? 's' : ''}`}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {results.map((lead, i) => (
                  <div key={i} onClick={() => toggleSelect(i)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selected.has(i) ? 'bg-violet-500/10 border-violet-500/30' : 'bg-[#111111] border-white/5 hover:border-white/10'}`}>
                    <input type="checkbox" checked={selected.has(i)} onChange={() => toggleSelect(i)} onClick={(e) => e.stopPropagation()} className="w-4 h-4 accent-violet-500 shrink-0" />
                    <div className="flex-1 min-w-0 grid sm:grid-cols-4 gap-2">
                      <div>
                        <div className="text-sm font-medium text-white truncate">{nameOf(lead)}</div>
                        <div className="text-xs text-zinc-500 truncate">{lead.title || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 truncate">{lead.company || '—'}</div>
                        <div className="text-xs text-zinc-600 truncate">{lead.industry || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 truncate">{lead.email || '—'}</div>
                        <div className="text-xs text-zinc-600 truncate">{lead.phone || '—'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 truncate">{lead.location || '—'}</span>
                        {lead.linkedin_url && (
                          <a href={lead.linkedin_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-400 hover:text-blue-300 shrink-0">
                            <Link2 size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!searching && results.length === 0 && keywords && (
            <div className="text-center py-16 text-zinc-500">No results found. Try different keywords.</div>
          )}
          {!keywords && results.length === 0 && (
            <div className="text-center py-16">
              <Users size={40} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Enter keywords to search for leads via Apollo.io</p>
            </div>
          )}
        </div>
      )}

      {/* ── Saved tab ── */}
      {tab === 'saved' && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={searchLeads} onChange={(e) => setSearchLeads(e.target.value)}
                placeholder="Search leads..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111111] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#111111] border border-white/10 text-white text-sm focus:outline-none">
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
            {leads.length > 0 && (
              <button onClick={exportCsv}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all">
                <Download size={14} /> Export CSV
              </button>
            )}
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
              <Plus size={14} /> Add Lead
            </button>
          </div>

          {/* Bulk delete bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <span className="text-sm text-red-400">{selectedIds.size} lead{selectedIds.size > 1 ? 's' : ''} selected</span>
              <button onClick={deleteSelected} disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white text-sm font-medium transition-all">
                <Trash2 size={13} />
                {deleting ? 'Deleting...' : `Delete ${selectedIds.size}`}
              </button>
            </div>
          )}

          {loadingLeads ? (
            <div className="text-center py-16 text-zinc-500">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16">
              <Users size={40} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 mb-4">No saved leads yet.</p>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all mx-auto">
                <Plus size={14} /> Add Lead Manually
              </button>
            </div>
          ) : (
            <>
              {/* Select all row */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <input type="checkbox"
                  checked={selectedIds.size === leads.length && leads.length > 0}
                  onChange={toggleAllLeads}
                  className="w-4 h-4 accent-violet-500" />
                <span className="text-xs text-zinc-500">Select all ({leads.length})</span>
              </div>

              <div className="space-y-2">
                {leads.map((lead) => (
                  <div key={lead.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedIds.has(lead.id!) ? 'bg-red-500/5 border-red-500/20' : 'bg-[#111111] border-white/5'}`}>
                    <input type="checkbox"
                      checked={selectedIds.has(lead.id!)}
                      onChange={() => toggleLeadId(lead.id!)}
                      className="w-4 h-4 accent-red-500 shrink-0" />
                    <div className="flex-1 min-w-0 grid sm:grid-cols-4 gap-2">
                      <div>
                        <div className="text-sm font-medium text-white truncate">{nameOf(lead)}</div>
                        <div className="text-xs text-zinc-500 truncate">{lead.title || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 truncate">{lead.company || '—'}</div>
                        <div className="text-xs text-zinc-600 truncate">{lead.email || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 truncate">{lead.phone || '—'}</div>
                        <div className="text-xs text-zinc-600 truncate">{lead.location || '—'}</div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        {lead.linkedin_url && (
                          <a href={lead.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <select value={lead.status ?? 'new'} onChange={(e) => lead.id && updateStatus(lead.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs font-medium border-0 focus:outline-none ${STATUS_COLORS[lead.status ?? 'new']} bg-transparent`}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button onClick={() => lead.id && deleteLead(lead.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Add Lead Modal ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Lead Manually</h2>
              <button onClick={() => { setShowAdd(false); setForm({ ...BLANK }) }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {field('first_name', 'John', 'First Name')}
              {field('last_name', 'Smith', 'Last Name')}
              {field('email', 'john@company.com', 'Email')}
              {field('phone', '+1 929 520 5538', 'Phone')}
              {field('company', 'Acme Inc', 'Company')}
              {field('title', 'Marketing Manager', 'Job Title')}
              {field('location', 'New York, US', 'Location')}
              {field('industry', 'E-Commerce', 'Industry')}
              <div className="col-span-2">
                {field('linkedin_url', 'https://linkedin.com/in/...', 'LinkedIn URL')}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowAdd(false); setForm({ ...BLANK }) }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-sm transition-all">
                Cancel
              </button>
              <button onClick={addManual} disabled={addSaving || (!form.email && !form.phone)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm transition-all">
                <Plus size={14} />
                {addSaving ? 'Adding...' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
