'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Phone, Plus, Play, Pause, ChevronLeft, Upload, Users, ClipboardList, RefreshCw, Trash2, Square } from 'lucide-react'

type Campaign = {
  id: string
  name: string
  status: 'draft' | 'running' | 'completed' | 'paused'
  total_calls: number
  answered: number
  interested: number
  booked: number
  created_at: string
}

type CallLog = {
  id: string
  contact_name: string | null
  contact_phone: string
  contact_company: string | null
  status: string
  outcome: string | null
  retry_count: number
  collected_email: string | null
  notes: string | null
  created_at: string
}

type Contact = { name: string; phone: string; company: string; website: string; industry: string }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-zinc-500/10 text-zinc-400',
  calling: 'bg-blue-500/10 text-blue-400',
  answered: 'bg-cyan-500/10 text-cyan-400',
  no_answer: 'bg-yellow-500/10 text-yellow-400',
  retry_scheduled: 'bg-orange-500/10 text-orange-400',
  interested: 'bg-green-500/10 text-green-400',
  not_interested: 'bg-red-500/10 text-red-400',
  booked: 'bg-violet-500/10 text-violet-400',
  failed: 'bg-red-500/10 text-red-400',
}

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-500/10 text-zinc-400',
  running: 'bg-blue-500/10 text-blue-400',
  paused: 'bg-yellow-500/10 text-yellow-400',
  completed: 'bg-green-500/10 text-green-400',
}

export default function OutboundPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [calling, setCalling] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Create campaign state
  const [campaignName, setCampaignName] = useState('')
  const [addTab, setAddTab] = useState<'csv' | 'manual' | 'leads'>('csv')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [manualText, setManualText] = useState('')
  const [leads, setLeads] = useState<{ id: string; first_name: string | null; last_name: string | null; phone: string | null; company: string | null }[]>([])
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchCampaigns = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/outbound')
    if (res.ok) setCampaigns(await res.json())
    setLoading(false)
  }

  const fetchCampaignDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/outbound?campaignId=${id}`)
    if (res.ok) {
      const { campaign, logs } = await res.json()
      setActiveCampaign(campaign)
      setCallLogs(logs)
    }
  }, [])

  useEffect(() => { fetchCampaigns() }, [])

  // Auto-refresh campaign detail every 5s when running
  useEffect(() => {
    if (activeCampaign?.status !== 'running') return
    const interval = setInterval(() => {
      fetchCampaignDetail(activeCampaign.id)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeCampaign?.status, activeCampaign?.id, fetchCampaignDetail])

  useEffect(() => {
    if (addTab === 'leads') {
      fetch('/api/admin/leads').then(r => r.ok && r.json()).then(d => d && setLeads(d.filter((l: { phone: string | null }) => l.phone)))
    }
  }, [addTab])

  const parseCSV = (text: string): Contact[] => {
    const lines = text.trim().split('\n').filter(Boolean)
    return lines.slice(lines[0].toLowerCase().includes('phone') ? 1 : 0).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      return { name: cols[0] ?? '', phone: cols[1] ?? '', company: cols[2] ?? '', website: cols[3] ?? '', industry: cols[4] ?? '' }
    }).filter(c => c.phone)
  }

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setContacts(parseCSV(ev.target?.result as string))
    reader.readAsText(file)
  }

  const parseManual = () => {
    const lines = manualText.trim().split('\n').filter(Boolean)
    const parsed = lines.map(line => {
      const parts = line.split(',').map(p => p.trim())
      if (parts.length === 1) return { name: '', phone: parts[0], company: '', website: '', industry: '' }
      return { name: parts[0], phone: parts[1], company: parts[2] ?? '', website: parts[3] ?? '', industry: parts[4] ?? '' }
    }).filter(c => c.phone)
    setContacts(parsed)
  }

  const leadsToContacts = (): Contact[] =>
    leads
      .filter(l => selectedLeads.has(l.id) && l.phone)
      .map(l => ({
        name: `${l.first_name ?? ''} ${l.last_name ?? ''}`.trim(),
        phone: l.phone!,
        company: l.company ?? '',
        website: '',
        industry: '',
      }))

  const allContacts = addTab === 'leads' ? leadsToContacts() : contacts

  const createCampaign = async () => {
    if (!campaignName || allContacts.length === 0) return
    setCreating(true)
    const res = await fetch('/api/admin/outbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: campaignName, contacts: allContacts }),
    })
    if (res.ok) {
      const { id } = await res.json()
      setShowCreate(false)
      setCampaignName('')
      setContacts([])
      setManualText('')
      setSelectedLeads(new Set())
      await fetchCampaigns()
      if (id) await fetchCampaignDetail(id)
    }
    setCreating(false)
  }

  const startCalls = async (campaignId: string) => {
    setCalling(true)
    const res = await fetch('/api/admin/outbound/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId }),
    })
    const data = await res.json()
    setCalling(false)
    if (activeCampaign) await fetchCampaignDetail(activeCampaign.id)
    await fetchCampaigns()
    if (data.fired !== undefined) {
      alert(`Calls started: ${data.fired} dialed, ${data.failed} failed`)
    }
  }

  const updateCampaignStatus = async (id: string, status: Campaign['status']) => {
    setUpdatingStatus(true)
    await fetch('/api/admin/outbound', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (activeCampaign) await fetchCampaignDetail(id)
    await fetchCampaigns()
    setUpdatingStatus(false)
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign and all its call logs? This cannot be undone.')) return
    setDeletingId(id)
    await fetch('/api/admin/outbound', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    if (activeCampaign?.id === id) setActiveCampaign(null)
    await fetchCampaigns()
  }

  const viewCampaign = async (c: Campaign) => {
    setActiveCampaign(c)
    await fetchCampaignDetail(c.id)
  }

  if (activeCampaign) {
    const done = callLogs.filter(l => !['pending', 'calling', 'retry_scheduled'].includes(l.status)).length
    const noAnswer = callLogs.filter(l => l.status === 'no_answer').length
    const notInterested = callLogs.filter(l => l.status === 'not_interested').length
    const retrying = callLogs.filter(l => l.status === 'retry_scheduled').length
    const inProgress = callLogs.filter(l => l.status === 'calling').length
    const progress = activeCampaign.total_calls > 0
      ? Math.round((done / activeCampaign.total_calls) * 100)
      : 0

    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveCampaign(null)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{activeCampaign.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${CAMPAIGN_STATUS_COLORS[activeCampaign.status]}`}>
              {activeCampaign.status}
              {activeCampaign.status === 'running' && <span className="ml-1 animate-pulse">·</span>}
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => fetchCampaignDetail(activeCampaign.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all"
            >
              <RefreshCw size={13} /> Refresh
            </button>

            {/* Pause button when running */}
            {activeCampaign.status === 'running' && (
              <button
                onClick={() => updateCampaignStatus(activeCampaign.id, 'paused')}
                disabled={updatingStatus}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 disabled:opacity-60 text-yellow-400 text-sm font-medium transition-all"
              >
                <Pause size={13} /> Pause
              </button>
            )}

            {/* Resume button when paused */}
            {activeCampaign.status === 'paused' && (
              <button
                onClick={() => startCalls(activeCampaign.id)}
                disabled={calling}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-medium transition-all"
              >
                <Play size={13} /> Resume Calls
              </button>
            )}

            {/* Stop/complete button when running or paused */}
            {(activeCampaign.status === 'running' || activeCampaign.status === 'paused') && (
              <button
                onClick={() => updateCampaignStatus(activeCampaign.id, 'completed')}
                disabled={updatingStatus}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-60 text-zinc-400 hover:text-white text-sm transition-all"
              >
                <Square size={13} /> Stop
              </button>
            )}

            {/* Start calls button for draft */}
            {activeCampaign.status === 'draft' && (
              <button
                onClick={() => startCalls(activeCampaign.id)}
                disabled={calling}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-medium transition-all"
              >
                <Play size={13} />
                {calling ? 'Starting...' : 'Start Calls'}
              </button>
            )}

            {/* Delete button */}
            <button
              onClick={() => deleteCampaign(activeCampaign.id)}
              disabled={deletingId === activeCampaign.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 disabled:opacity-60 text-red-400 text-sm transition-all"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total', value: activeCampaign.total_calls, color: 'text-white' },
            { label: 'Answered', value: activeCampaign.answered, color: 'text-cyan-400' },
            { label: 'Interested', value: activeCampaign.interested, color: 'text-green-400' },
            { label: 'Booked', value: activeCampaign.booked, color: 'text-violet-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl bg-[#111111] border border-white/5">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Secondary stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'In Progress', value: inProgress, color: 'text-blue-400' },
            { label: 'No Answer', value: noAnswer, color: 'text-yellow-400' },
            { label: 'Not Interested', value: notInterested, color: 'text-red-400' },
            { label: 'Retry Scheduled', value: retrying, color: 'text-orange-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-[#111111] border border-white/5">
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Progress — {done} of {activeCampaign.total_calls} calls completed</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Call logs */}
        <div className="space-y-2">
          {callLogs.map(log => (
            <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-white/5">
              <div className="flex-1 grid grid-cols-4 gap-2">
                <div>
                  <div className="text-sm font-medium text-white">{log.contact_name || '—'}</div>
                  <div className="text-xs text-zinc-500">{log.contact_phone}</div>
                </div>
                <div className="text-xs text-zinc-400 self-center">{log.contact_company || '—'}</div>
                <div className="self-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[log.status] ?? 'bg-zinc-500/10 text-zinc-400'}`}>
                    {log.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 self-center truncate">
                  {log.collected_email && <span className="text-violet-400 block">{log.collected_email}</span>}
                  {log.notes && <span className="block truncate">{log.notes}</span>}
                  {log.retry_count > 0 && <span className="text-orange-400"> retry #{log.retry_count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Outbound Calls</h1>
          <p className="text-zinc-500 text-sm">Cold call campaigns powered by Jordan — AI cold call specialist</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all"
        >
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Campaigns', value: campaigns.length },
          { label: 'Total Calls', value: campaigns.reduce((s, c) => s + c.total_calls, 0) },
          { label: 'Interested', value: campaigns.reduce((s, c) => s + c.interested, 0) },
          { label: 'Booked', value: campaigns.reduce((s, c) => s + c.booked, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="p-5 rounded-2xl bg-[#111111] border border-white/5">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Campaign list */}
      {loading ? (
        <div className="text-center py-16 text-zinc-500">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16">
          <Phone size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No campaigns yet. Create one to start cold calling.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-5 rounded-2xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
              <div
                className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 cursor-pointer"
                onClick={() => viewCampaign(c)}
              >
                <Phone size={16} className="text-violet-400" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => viewCampaign(c)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{c.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CAMPAIGN_STATUS_COLORS[c.status]}`}>{c.status}</span>
                </div>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span>{c.total_calls} contacts</span>
                  <span>{c.answered} answered</span>
                  <span>{c.interested} interested</span>
                  <span className="text-violet-400">{c.booked} booked</span>
                </div>
              </div>
              <div className="text-xs text-zinc-600">{new Date(c.created_at).toLocaleDateString()}</div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id) }}
                disabled={deletingId === c.id}
                className="p-2 rounded-xl hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all disabled:opacity-40"
                title="Delete campaign"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">New Cold Call Campaign</h2>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Campaign Name</label>
              <input
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="e.g. Ecommerce Outreach May 2026"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 mb-6"
              />

              {/* Source tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-[#0a0a0a] border border-white/5 w-fit mb-5">
                {([['csv', 'Upload CSV'], ['manual', 'Paste Numbers'], ['leads', 'From Leads']] as const).map(([t, label]) => (
                  <button key={t} onClick={() => setAddTab(t)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${addTab === t ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {addTab === 'csv' && (
                <div>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-violet-500/30 rounded-xl p-8 text-center cursor-pointer transition-all"
                  >
                    <Upload size={24} className="text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">Click to upload CSV</p>
                    <p className="text-xs text-zinc-600 mt-1">Columns: Name, Phone, Company, Website, Industry</p>
                  </div>
                  <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
                  {contacts.length > 0 && <p className="text-xs text-green-400 mt-2">✓ {contacts.length} contacts loaded</p>}
                </div>
              )}

              {addTab === 'manual' && (
                <div>
                  <textarea
                    value={manualText}
                    onChange={e => setManualText(e.target.value)}
                    rows={6}
                    placeholder={"+1 929 520 5538\nJohn Smith, +1 929 520 5538, Acme Inc, acme.com, Ecommerce\nJane Doe, +44 7700 900123, Global Corp, globalcorp.com, Retail"}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 resize-none font-mono mb-2"
                  />
                  <button onClick={parseManual} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition-all">
                    Parse Numbers
                  </button>
                  {contacts.length > 0 && <span className="text-xs text-green-400 ml-3">✓ {contacts.length} contacts</span>}
                </div>
              )}

              {addTab === 'leads' && (
                <div className="max-h-56 overflow-y-auto space-y-1.5">
                  {leads.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-8">No leads with phone numbers saved yet.</p>
                  ) : leads.map(l => (
                    <label key={l.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${selectedLeads.has(l.id) ? 'bg-violet-500/10 border-violet-500/30' : 'bg-[#0a0a0a] border-white/5'}`}>
                      <input type="checkbox" checked={selectedLeads.has(l.id)} onChange={() => {
                        setSelectedLeads(prev => { const n = new Set(prev); n.has(l.id) ? n.delete(l.id) : n.add(l.id); return n })
                      }} className="w-3.5 h-3.5 accent-violet-500" />
                      <span className="text-sm text-white">{`${l.first_name ?? ''} ${l.last_name ?? ''}`.trim() || '—'}</span>
                      <span className="text-xs text-zinc-500">{l.phone} · {l.company}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => { setShowCreate(false); setContacts([]); setManualText('') }} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-sm transition-all">
                Cancel
              </button>
              <button
                onClick={createCampaign}
                disabled={creating || !campaignName || allContacts.length === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm transition-all"
              >
                <ClipboardList size={14} />
                {creating ? 'Creating...' : `Create Campaign (${allContacts.length} contacts)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
