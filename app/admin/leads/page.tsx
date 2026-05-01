'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Upload, Folder, FolderOpen, Trash2, Mail, Phone,
  Building2, MapPin, ExternalLink, Search, X, FileText, AlertCircle
} from 'lucide-react'
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
  new: 'New',
  contacted: 'Contacted',
  email_sent: 'Email Sent',
  qualified: 'Qualified',
  closed: 'Closed',
}

// Map common CSV/Excel column names to our fields
const COLUMN_MAP: Record<string, string> = {
  'first name': 'first_name', 'firstname': 'first_name', 'first_name': 'first_name',
  'last name': 'last_name', 'lastname': 'last_name', 'last_name': 'last_name',
  'name': 'full_name', 'full name': 'full_name', 'fullname': 'full_name', 'contact name': 'full_name',
  'email': 'email', 'email address': 'email', 'e-mail': 'email', 'mail': 'email',
  'company': 'company', 'company name': 'company', 'organization': 'company', 'business': 'company', 'business name': 'company',
  'phone': 'phone', 'phone number': 'phone', 'mobile': 'phone', 'cell': 'phone', 'telephone': 'phone',
  'title': 'title', 'job title': 'title', 'position': 'title', 'role': 'title', 'designation': 'title',
  'industry': 'industry', 'category': 'industry', 'vertical': 'industry', 'type': 'industry', 'sector': 'industry', 'niche': 'industry',
  'location': 'location', 'city': 'location', 'country': 'location', 'state': 'location', 'address': 'location', 'region': 'location',
  'linkedin': 'linkedin_url', 'linkedin url': 'linkedin_url', 'linkedin_url': 'linkedin_url', 'linkedin profile': 'linkedin_url',
}

type ParsedLead = Record<string, string>

function parseCSV(text: string): ParsedLead[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase())
  const mappedHeaders = headers.map(h => COLUMN_MAP[h] || null)

  return lines.slice(1).map(line => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes }
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = '' }
      else { current += char }
    }
    values.push(current.trim())

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
  return {
    first_name: first_name || null,
    last_name: last_name || null,
    email: p.email || null,
    company: p.company || null,
    title: p.title || null,
    phone: p.phone || null,
    industry: p.industry || null,
    location: p.location || null,
    linkedin_url: p.linkedin_url || null,
  }
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/leads')
      .then(r => r.json())
      .then(data => setLeads(Array.isArray(data) ? data : []))
  }, [])

  const categories = Array.from(new Set(leads.map(l => l.industry).filter(Boolean))).sort() as string[]

  const filteredLeads = leads.filter(lead => {
    if (activeCategory === 'uncategorized' && lead.industry) return false
    if (activeCategory !== 'all' && activeCategory !== 'uncategorized' && lead.industry !== activeCategory) return false
    if (statusFilter && lead.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        lead.first_name?.toLowerCase().includes(q) ||
        lead.last_name?.toLowerCase().includes(q) ||
        lead.company?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.title?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleFile = useCallback(async (file: File) => {
    setUploading(true)
    setUploadError('')
    setUploadSuccess('')

    try {
      let parsed: ParsedLead[] = []

      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        parsed = parseCSV(text)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const { read, utils } = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const wb = read(buffer)
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = utils.sheet_to_json<Record<string, string>>(ws, { defval: '' })
        parsed = rows.map(row => {
          const lead: ParsedLead = {}
          Object.entries(row).forEach(([key, value]) => {
            const mapped = COLUMN_MAP[key.toLowerCase().trim()]
            if (mapped && String(value).trim()) lead[mapped] = String(value).trim()
          })
          return lead
        })
      } else {
        setUploadError('Please upload a .csv or .xlsx file')
        return
      }

      if (parsed.length === 0) {
        setUploadError('No leads found. Make sure your file has proper column headers.')
        return
      }

      const normalized = parsed.map(normalizeLead)

      const res = await fetch('/api/admin/leads/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: normalized }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')

      const updated = await fetch('/api/admin/leads').then(r => r.json())
      setLeads(Array.isArray(updated) ? updated : [])
      setUploadSuccess(`${data.imported} leads imported successfully`)
      setTimeout(() => setUploadSuccess(''), 4000)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const updateStatus = async (id: string, status: LeadStatus) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const deleteLead = async (id: string) => {
    setDeletingId(id)
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLeads(prev => prev.filter(l => l.id !== id))
    setDeletingId(null)
  }

  const categoryCounts = leads.reduce((acc, lead) => {
    const cat = lead.industry || '__uncategorized__'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex h-full">
      {/* Category Sidebar */}
      <div className="w-52 shrink-0 border-r border-white/5 overflow-y-auto py-5 px-3">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-3 px-2">Categories</p>

        <button
          onClick={() => setActiveCategory('all')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
            activeCategory === 'all' ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><Folder size={14} />All Leads</span>
          <span className="text-xs text-zinc-600">{leads.length}</span>
        </button>

        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
              activeCategory === cat ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              {activeCategory === cat ? <FolderOpen size={14} className="shrink-0" /> : <Folder size={14} className="shrink-0" />}
              <span className="truncate">{cat}</span>
            </span>
            <span className="text-xs text-zinc-600 shrink-0 ml-1">{categoryCounts[cat] || 0}</span>
          </button>
        ))}

        {categoryCounts['__uncategorized__'] > 0 && (
          <button
            onClick={() => setActiveCategory('uncategorized')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
              activeCategory === 'uncategorized' ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2"><Folder size={14} />Uncategorized</span>
            <span className="text-xs text-zinc-600">{categoryCounts['__uncategorized__']}</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Lead Generation</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {activeCategory === 'all' ? 'All leads' : activeCategory === 'uncategorized' ? 'Uncategorized' : activeCategory}
              {' '}— {filteredLeads.length} leads
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all"
          >
            <Upload size={15} />
            {uploading ? 'Importing...' : 'Import CSV / Excel'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* Feedback banners */}
        {uploadError && (
          <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            <span className="flex items-center gap-2"><AlertCircle size={15} />{uploadError}</span>
            <button onClick={() => setUploadError('')}><X size={14} /></button>
          </div>
        )}
        {uploadSuccess && (
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
            ✓ {uploadSuccess}
          </div>
        )}
        {uploading && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            Parsing and importing leads...
          </div>
        )}

        {/* Empty state — drop zone */}
        {leads.length === 0 && !uploading && (
          <div
            onDrop={onDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
              dragOver ? 'border-violet-500/60 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/30 hover:bg-white/[0.02]'
            }`}
          >
            <Upload size={36} className="mx-auto mb-4 text-zinc-600" />
            <p className="text-white font-semibold mb-1">Drop your file here or click to upload</p>
            <p className="text-zinc-500 text-sm mb-4">Supports .csv and .xlsx (Excel) files</p>
            <div className="text-zinc-600 text-xs space-y-1">
              <p>Recognized columns: <span className="text-zinc-500">Name, Email, Company, Phone, Industry, Location, Title, LinkedIn</span></p>
              <p>Leads will be grouped into folders automatically by their Industry / Category column</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {leads.length > 0 && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search name, company, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl bg-[#111111] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#111111] border border-white/8 text-sm text-white focus:outline-none focus:border-violet-500/40"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            {(searchQuery || statusFilter) && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('') }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/8 text-zinc-500 hover:text-white text-sm transition-all"
              >
                <X size={13} /> Clear
              </button>
            )}
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/10 hover:border-violet-500/30 text-zinc-500 hover:text-violet-300 text-sm cursor-pointer transition-all"
            >
              <Upload size={13} /> Import more
            </div>
          </div>
        )}

        {/* Leads Table */}
        {filteredLeads.length > 0 && (
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Name', 'Company', 'Title', 'Contact', 'Location', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs text-zinc-600 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs shrink-0">
                            {(lead.first_name || lead.last_name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium whitespace-nowrap">
                            {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1.5 text-zinc-300 whitespace-nowrap">
                          <Building2 size={12} className="text-zinc-600 shrink-0" />
                          {lead.company || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-xs whitespace-nowrap">{lead.title || '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-0.5">
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                              <Mail size={11} />{lead.email}
                            </a>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <Phone size={11} />{lead.phone}
                            </span>
                          )}
                          {!lead.email && !lead.phone && <span className="text-zinc-600 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-xs text-zinc-500 whitespace-nowrap">
                          <MapPin size={11} />{lead.location || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer bg-transparent focus:outline-none ${STATUS_STYLES[lead.status as LeadStatus] ?? STATUS_STYLES.new}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-[#1a1a1a] text-white">{STATUS_LABELS[s]}</option>
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
  )
}
