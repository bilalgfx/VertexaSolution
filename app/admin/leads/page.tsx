'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Upload, Folder, FolderOpen, Trash2, Mail, Phone,
  Building2, MapPin, Search, X, FileText,
  AlertCircle, Download, SlidersHorizontal, Eye, Globe,
} from 'lucide-react'
import EmailComposer from '@/app/components/admin/EmailComposer'

const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
)
const IconFacebook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const IconTwitter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
import type { Lead } from '@/lib/types'

const STATUS_OPTIONS = ['new', 'contacted', 'email_sent', 'qualified', 'closed'] as const
type LeadStatus = typeof STATUS_OPTIONS[number]

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  contacted: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  email_sent: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  qualified: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New', contacted: 'Contacted', email_sent: 'Email Sent',
  qualified: 'Qualified', closed: 'Closed',
}

type ColKey = 'name' | 'company' | 'title' | 'email' | 'phone' | 'location' | 'linkedin' | 'facebook' | 'instagram' | 'twitter' | 'website' | 'status'

const ALL_COLUMNS: { key: ColKey; label: string; default: boolean }[] = [
  { key: 'name', label: 'Name', default: true },
  { key: 'company', label: 'Company', default: true },
  { key: 'title', label: 'Title', default: true },
  { key: 'email', label: 'Email', default: true },
  { key: 'phone', label: 'Phone', default: true },
  { key: 'location', label: 'Location', default: true },
  { key: 'linkedin', label: 'LinkedIn', default: true },
  { key: 'facebook', label: 'Facebook', default: false },
  { key: 'instagram', label: 'Instagram', default: false },
  { key: 'twitter', label: 'Twitter / X', default: false },
  { key: 'website', label: 'Website', default: false },
  { key: 'status', label: 'Status', default: true },
]

const COLUMN_MAP: Record<string, string> = {
  // Name
  'first name': 'first_name', 'firstname': 'first_name', 'first_name': 'first_name',
  'last name': 'last_name', 'lastname': 'last_name', 'last_name': 'last_name',
  'name': 'full_name', 'full name': 'full_name', 'fullname': 'full_name', 'contact name': 'full_name', 'contact': 'full_name',
  // Email
  'email': 'email', 'email address': 'email', 'e-mail': 'email', 'mail': 'email',
  // Company
  'company': 'company', 'company name': 'company', 'company name for emails': 'company',
  'organization': 'company', 'business': 'company', 'business name': 'company',
  // Phone — Apollo exports multiple phone columns, we prioritise work > mobile > corporate
  'phone': 'phone', 'phone number': 'phone', 'contact number': 'phone', 'telephone': 'phone',
  'work direct phone': 'phone_work', 'direct phone': 'phone_work',
  'mobile phone': 'phone_mobile', 'mobile': 'phone_mobile', 'mobile number': 'phone_mobile', 'cell': 'phone_mobile',
  'home phone': 'phone_home',
  'corporate phone': 'phone_corp',
  'other phone': 'phone_other',
  'company phone': 'phone_company',
  // Title
  'title': 'title', 'job title': 'title', 'position': 'title', 'role': 'title', 'designation': 'title',
  // Industry
  'industry': 'industry', 'category': 'industry', 'vertical': 'industry', 'type': 'industry', 'sector': 'industry', 'niche': 'industry',
  // Location — Apollo splits into city/state/country, we combine in normalizeLead
  'location': 'location', 'address': 'location', 'region': 'location',
  'city': 'city', 'state': 'state', 'country': 'country',
  // LinkedIn
  'linkedin': 'linkedin_url', 'linkedin url': 'linkedin_url', 'linkedin_url': 'linkedin_url',
  'linkedin profile': 'linkedin_url', 'person linkedin url': 'linkedin_url',
  // Facebook
  'facebook': 'facebook_url', 'facebook url': 'facebook_url', 'facebook profile': 'facebook_url', 'fb': 'facebook_url',
  // Instagram
  'instagram': 'instagram_url', 'instagram url': 'instagram_url', 'ig': 'instagram_url', 'insta': 'instagram_url',
  // Twitter
  'twitter': 'twitter_url', 'twitter url': 'twitter_url', 'x': 'twitter_url', 'x url': 'twitter_url',
  // Website
  'website': 'website', 'website url': 'website', 'web': 'website', 'url': 'website', 'site': 'website',
}

type ParsedLead = Record<string, string>

function parseCSV(text: string): ParsedLead[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase())
  const mappedHeaders = headers.map(h => COLUMN_MAP[h] || null)
  return lines.slice(1).map(line => {
    const values: string[] = []
    let cur = '', inQ = false
    for (const c of line) {
      if (c === '"') inQ = !inQ
      else if (c === ',' && !inQ) { values.push(cur.trim()); cur = '' }
      else cur += c
    }
    values.push(cur.trim())
    const lead: ParsedLead = {}
    mappedHeaders.forEach((key, i) => {
      if (key && values[i]) lead[key] = values[i].replace(/^"|"$/g, '')
    })
    return lead
  }).filter(l => Object.keys(l).length > 0)
}

function normalizeLead(p: ParsedLead) {
  let first_name = p.first_name || ''
  let last_name = p.last_name || ''
  if (!first_name && p.full_name) {
    const parts = p.full_name.trim().split(/\s+/)
    first_name = parts[0] || ''
    last_name = parts.slice(1).join(' ')
  }
  // Pick best phone: work > mobile > corporate > home > other > company > generic
  const phone = p.phone_work || p.phone_mobile || p.phone_corp || p.phone_home || p.phone_other || p.phone_company || p.phone || null
  // Combine city/state/country into location if not already a combined string
  const location = p.location || [p.city, p.state, p.country].filter(Boolean).join(', ') || null
  return {
    first_name: first_name || null, last_name: last_name || null,
    email: p.email || null, company: p.company || null,
    title: p.title || null, phone, industry: p.industry || null, location,
    linkedin_url: p.linkedin_url || null, facebook_url: p.facebook_url || null,
    instagram_url: p.instagram_url || null, twitter_url: p.twitter_url || null,
    website: p.website || null,
  }
}

function exportToCSV(leads: Lead[], visibleCols: Set<ColKey>) {
  const colMap: Partial<Record<ColKey, (l: Lead) => string>> = {
    name: l => [l.first_name, l.last_name].filter(Boolean).join(' '),
    company: l => l.company || '',
    title: l => l.title || '',
    email: l => l.email || '',
    phone: l => l.phone || '',
    location: l => l.location || '',
    linkedin: l => l.linkedin_url || '',
    facebook: l => l.facebook_url || '',
    instagram: l => l.instagram_url || '',
    twitter: l => l.twitter_url || '',
    website: l => l.website || '',
    status: l => STATUS_LABELS[l.status as LeadStatus] || l.status,
  }
  const cols = ALL_COLUMNS.filter(c => visibleCols.has(c.key))
  const header = cols.map(c => c.label).join(',')
  const rows = leads.map(l => cols.map(c => {
    const val = colMap[c.key]?.(l) || ''
    return val.includes(',') ? `"${val}"` : val
  }).join(','))
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [composingLead, setComposingLead] = useState<{ email: string; name: string; company: string | null } | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [showColPicker, setShowColPicker] = useState(false)
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(ALL_COLUMNS.filter(c => c.default).map(c => c.key))
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/leads').then(r => r.json()).then(d => setLeads(Array.isArray(d) ? d : []))
  }, [])

  const categories = Array.from(new Set(leads.map(l => l.industry).filter(Boolean))).sort() as string[]

  const filteredLeads = leads.filter(lead => {
    if (activeCategory === 'uncategorized' && lead.industry) return false
    if (activeCategory !== 'all' && activeCategory !== 'uncategorized' && lead.industry !== activeCategory) return false
    if (statusFilter && lead.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return [lead.first_name, lead.last_name, lead.company, lead.email, lead.title, lead.phone, lead.location]
        .some(v => v?.toLowerCase().includes(q))
    }
    return true
  })

  const handleFile = useCallback(async (file: File) => {
    setUploading(true); setUploadError(''); setUploadSuccess('')
    try {
      let parsed: ParsedLead[] = []
      if (file.name.endsWith('.csv')) {
        parsed = parseCSV(await file.text())
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const { read, utils } = await import('xlsx')
        const wb = read(await file.arrayBuffer())
        const rows = utils.sheet_to_json<Record<string, string>>(wb.Sheets[wb.SheetNames[0]], { defval: '' })
        parsed = rows.map(row => {
          const lead: ParsedLead = {}
          Object.entries(row).forEach(([k, v]) => {
            const mapped = COLUMN_MAP[k.toLowerCase().trim()]
            if (mapped && String(v).trim()) lead[mapped] = String(v).trim()
          })
          return lead
        })
      } else {
        setUploadError('Please upload a .csv or .xlsx file'); return
      }
      if (parsed.length === 0) { setUploadError('No leads found. Check column headers.'); return }
      const res = await fetch('/api/admin/leads/import', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: parsed.map(normalizeLead) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      const updated = await fetch('/api/admin/leads').then(r => r.json())
      setLeads(Array.isArray(updated) ? updated : [])
      setUploadSuccess(`${data.imported} leads imported`)
      setTimeout(() => setUploadSuccess(''), 4000)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]; if (file) handleFile(file)
  }, [handleFile])

  const updateStatus = async (id: string, status: LeadStatus) => {
    await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const deleteLead = async (id: string) => {
    setDeletingId(id)
    await fetch('/api/admin/leads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setLeads(prev => prev.filter(l => l.id !== id)); setDeletingId(null)
  }

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    await Promise.all([...selectedIds].map(id =>
      fetch('/api/admin/leads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    ))
    setLeads(prev => prev.filter(l => !selectedIds.has(l.id)))
    setSelectedIds(new Set())
    setBulkDeleting(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  const allVisibleSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedIds.has(l.id))

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(prev => { const s = new Set(prev); filteredLeads.forEach(l => s.delete(l.id)); return s })
    } else {
      setSelectedIds(prev => { const s = new Set(prev); filteredLeads.forEach(l => s.add(l.id)); return s })
    }
  }

  const toggleCol = (key: ColKey) => {
    setVisibleCols(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s })
  }

  const categoryCounts = leads.reduce((acc, l) => {
    const c = l.industry || '__u__'; acc[c] = (acc[c] || 0) + 1; return acc
  }, {} as Record<string, number>)

  const SocialLink = ({ url, icon: Icon, color }: { url: string | null; icon: React.ElementType; color: string }) =>
    url ? <a href={url} target="_blank" rel="noopener noreferrer" className={`${color} hover:opacity-80 transition-opacity`}><Icon size={14} /></a> : null

  return (
    <>
    <div className="flex h-full">
      {/* Category Sidebar */}
      <div className="w-52 shrink-0 border-r border-white/5 overflow-y-auto py-5 px-3">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-3 px-2">Categories</p>
        {[
          { id: 'all', label: 'All Leads', count: leads.length },
          ...categories.map(c => ({ id: c, label: c, count: categoryCounts[c] || 0 })),
          ...(categoryCounts['__u__'] ? [{ id: 'uncategorized', label: 'Uncategorized', count: categoryCounts['__u__'] }] : []),
        ].map(({ id, label, count }) => (
          <button key={id} onClick={() => setActiveCategory(id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${activeCategory === id ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="flex items-center gap-2 min-w-0">
              {activeCategory === id ? <FolderOpen size={14} className="shrink-0" /> : <Folder size={14} className="shrink-0" />}
              <span className="truncate">{label}</span>
            </span>
            <span className="text-xs text-zinc-600 shrink-0 ml-1">{count}</span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Lead Generation</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {activeCategory === 'all' ? 'All leads' : activeCategory === 'uncategorized' ? 'Uncategorized' : activeCategory} — {filteredLeads.length} leads
            </p>
          </div>
          <div className="flex items-center gap-2">
            {filteredLeads.length > 0 && (
              <button onClick={() => exportToCSV(filteredLeads, visibleCols)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-emerald-500/40 text-zinc-400 hover:text-emerald-400 text-sm font-medium transition-all">
                <Download size={15} /> Export CSV
              </button>
            )}
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all">
              <Upload size={15} />{uploading ? 'Importing...' : 'Import CSV / Excel'}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {/* Banners */}
        {uploadError && (
          <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            <span className="flex items-center gap-2"><AlertCircle size={15} />{uploadError}</span>
            <button onClick={() => setUploadError('')}><X size={14} /></button>
          </div>
        )}
        {uploadSuccess && (
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">✓ {uploadSuccess}</div>
        )}
        {uploading && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />Importing leads...
          </div>
        )}

        {/* Drop zone */}
        {leads.length === 0 && !uploading && (
          <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${dragOver ? 'border-violet-500/60 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/30 hover:bg-white/[0.02]'}`}>
            <Upload size={36} className="mx-auto mb-4 text-zinc-600" />
            <p className="text-white font-semibold mb-1">Drop your file here or click to upload</p>
            <p className="text-zinc-500 text-sm mb-4">Supports .csv and .xlsx (Excel) files</p>
            <p className="text-zinc-600 text-xs">Detected columns: Name, Email, Company, Phone, Industry, Location, Title, LinkedIn, Facebook, Instagram, Twitter, Website</p>
          </div>
        )}

        {/* Filters + Column Picker */}
        {leads.length > 0 && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Search name, company, email, phone..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl bg-[#111111] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 w-72" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#111111] border border-white/8 text-sm text-white focus:outline-none focus:border-violet-500/40">
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            {(searchQuery || statusFilter) && (
              <button onClick={() => { setSearchQuery(''); setStatusFilter('') }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/8 text-zinc-500 hover:text-white text-sm transition-all">
                <X size={13} />Clear
              </button>
            )}
            {selectedIds.size > 0 && (
              <button onClick={deleteSelected} disabled={bulkDeleting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-sm font-medium transition-all disabled:opacity-50">
                <Trash2 size={13} />{bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
              </button>
            )}

            {/* Column Picker */}
            <div className="relative ml-auto">
              <button onClick={() => setShowColPicker(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${showColPicker ? 'border-violet-500/40 text-violet-300' : 'border-white/8 text-zinc-400 hover:text-white'}`}>
                <Eye size={13} /><SlidersHorizontal size={13} /> Columns
              </button>
              {showColPicker && (
                <div className="absolute right-0 top-10 z-20 bg-[#1a1a1a] border border-white/10 rounded-xl p-3 w-48 shadow-xl">
                  <p className="text-xs text-zinc-500 mb-2 font-medium">Show / Hide Columns</p>
                  {ALL_COLUMNS.map(col => (
                    <label key={col.key} className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-white text-zinc-400 text-sm">
                      <input type="checkbox" checked={visibleCols.has(col.key)} onChange={() => toggleCol(col.key)}
                        className="accent-violet-500" />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/10 hover:border-violet-500/30 text-zinc-500 hover:text-violet-300 text-sm cursor-pointer transition-all">
              <Upload size={13} />Import more
            </div>
          </div>
        )}

        {/* Table */}
        {filteredLeads.length > 0 && (
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden" onClick={() => setShowColPicker(false)}>
            <div className="overflow-auto max-h-[calc(100vh-280px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#111111] z-10">
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} className="accent-violet-500 cursor-pointer" />
                    </th>
                    {visibleCols.has('name') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Name</th>}
                    {visibleCols.has('company') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Company</th>}
                    {visibleCols.has('title') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Title</th>}
                    {visibleCols.has('email') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Email</th>}
                    {visibleCols.has('phone') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Phone</th>}
                    {visibleCols.has('location') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Location</th>}
                    {(visibleCols.has('linkedin') || visibleCols.has('facebook') || visibleCols.has('instagram') || visibleCols.has('twitter') || visibleCols.has('website')) && (
                      <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Social</th>
                    )}
                    {visibleCols.has('status') && <th className="text-left px-4 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">Status</th>}
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className={`transition-colors group ${selectedIds.has(lead.id) ? 'bg-violet-500/5' : 'hover:bg-white/[0.02]'}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="accent-violet-500 cursor-pointer" />
                      </td>
                      {visibleCols.has('name') && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs shrink-0">
                              {(lead.first_name || lead.last_name || '?').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white font-medium whitespace-nowrap text-sm">
                              {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleCols.has('company') && (
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-zinc-300 whitespace-nowrap text-sm">
                            <Building2 size={11} className="text-zinc-600 shrink-0" />{lead.company || '—'}
                          </span>
                        </td>
                      )}
                      {visibleCols.has('title') && <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">{lead.title || '—'}</td>}
                      {visibleCols.has('email') && (
                        <td className="px-4 py-3">
                          {lead.email
                            ? <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 whitespace-nowrap"><Mail size={11} />{lead.email}</a>
                            : <span className="text-zinc-600 text-xs">—</span>}
                        </td>
                      )}
                      {visibleCols.has('phone') && (
                        <td className="px-4 py-3">
                          {lead.phone
                            ? <span className="flex items-center gap-1 text-xs text-zinc-300 whitespace-nowrap"><Phone size={11} className="text-zinc-600" />{lead.phone}</span>
                            : <span className="text-zinc-600 text-xs">—</span>}
                        </td>
                      )}
                      {visibleCols.has('location') && (
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-xs text-zinc-500 whitespace-nowrap"><MapPin size={11} />{lead.location || '—'}</span>
                        </td>
                      )}
                      {(visibleCols.has('linkedin') || visibleCols.has('facebook') || visibleCols.has('instagram') || visibleCols.has('twitter') || visibleCols.has('website')) && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {visibleCols.has('linkedin') && <SocialLink url={lead.linkedin_url} icon={IconLinkedIn} color="text-blue-400" />}
                            {visibleCols.has('facebook') && <SocialLink url={lead.facebook_url} icon={IconFacebook} color="text-blue-500" />}
                            {visibleCols.has('instagram') && <SocialLink url={lead.instagram_url} icon={IconInstagram} color="text-pink-400" />}
                            {visibleCols.has('twitter') && <SocialLink url={lead.twitter_url} icon={IconTwitter} color="text-sky-400" />}
                            {visibleCols.has('website') && <SocialLink url={lead.website} icon={Globe} color="text-zinc-400" />}
                            {!lead.linkedin_url && !lead.facebook_url && !lead.instagram_url && !lead.twitter_url && !lead.website && <span className="text-zinc-600 text-xs">—</span>}
                          </div>
                        </td>
                      )}
                      {visibleCols.has('status') && (
                        <td className="px-4 py-3">
                          <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer bg-transparent focus:outline-none ${STATUS_STYLES[lead.status as LeadStatus] ?? STATUS_STYLES.new}`}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#1a1a1a] text-white">{STATUS_LABELS[s]}</option>)}
                          </select>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {lead.email && (
                            <button onClick={() => setComposingLead({ email: lead.email!, name: [lead.first_name, lead.last_name].filter(Boolean).join(' '), company: lead.company })}
                              className="text-zinc-600 hover:text-violet-400 transition-colors" title="Send email">
                              <Mail size={14} />
                            </button>
                          )}
                          <button onClick={() => deleteLead(lead.id)} disabled={deletingId === lead.id}
                            className="text-zinc-600 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {leads.length > 0 && filteredLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <FileText size={28} className="mb-3 opacity-40" />
            <p className="text-sm">No leads match your filters</p>
          </div>
        )}
      </div>
    </div>

    <EmailComposer
      isOpen={!!composingLead}
      onClose={() => setComposingLead(null)}
      defaultTo={composingLead?.email ?? ''}
      defaultToName={composingLead?.name}
      defaultSubject={composingLead?.company ? `AI Automation for ${composingLead.company}` : 'AI Automation Services — Vertexa Solution'}
    />
    </>
  )
}
