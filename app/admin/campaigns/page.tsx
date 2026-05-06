'use client'

import { useEffect, useState } from 'react'
import { Mail, Send, ChevronLeft, ChevronRight, Users, FileText, CheckCircle } from 'lucide-react'

type Lead = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  status?: string
}

type Submission = {
  id: string
  name: string
  email: string
  company: string | null
  status?: string
}

type Campaign = {
  id: string
  subject: string
  recipient_count: number
  status: string
  sent_at: string
}

type RecipientSource = 'leads' | 'submissions'

export default function CampaignsPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [source, setSource] = useState<RecipientSource>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [recipientSearch, setRecipientSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/leads').then((r) => r.ok && r.json()).then((d) => d && setLeads(d))
    fetch('/api/admin/submissions').then((r) => r.ok && r.json()).then((d) => d && setSubmissions(d))
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    // Email campaigns are logged; we query the DB via an API-less approach here
    // If you add GET /api/admin/campaigns later, fetch from there
  }

  const allRecipients = source === 'leads'
    ? leads.filter(
        (l) =>
          l.email &&
          (recipientSearch === '' ||
            `${l.first_name} ${l.last_name} ${l.email} ${l.company}`.toLowerCase().includes(recipientSearch.toLowerCase()))
      )
    : submissions.filter(
        (s) =>
          s.email &&
          (recipientSearch === '' ||
            `${s.name} ${s.email} ${s.company}`.toLowerCase().includes(recipientSearch.toLowerCase()))
      )

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    const allIds = allRecipients.map((r) => r.id)
    setSelectedIds((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds)
    )
  }

  const send = async () => {
    setSending(true)
    const res = await fetch('/api/admin/email/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient_ids: Array.from(selectedIds),
        source,
        subject,
        body,
      }),
    })
    setSending(false)
    if (res.ok) {
      const data = await res.json()
      setResult(data)
      setStep(3)
    }
  }

  const reset = () => {
    setStep(1)
    setSelectedIds(new Set())
    setSubject('')
    setBody('')
    setResult(null)
    setRecipientSearch('')
  }

  const nameOf = (r: Lead | Submission) =>
    'name' in r ? r.name : `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim() || '—'

  const previewBody = body
    .replace(/\{\{name\}\}/g, nameOf(allRecipients[0] ?? { first_name: 'John', last_name: 'Smith' }) as string)
    .replace(/\{\{company\}\}/g, (allRecipients[0] as Lead)?.company ?? 'Acme Inc')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Email Campaigns</h1>
        <p className="text-zinc-500 text-sm">Send personalized bulk emails to leads or form submissions</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: 'Recipients' },
          { n: 2, label: 'Compose' },
          { n: 3, label: 'Done' },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                step === n
                  ? 'bg-violet-600 text-white'
                  : step > n
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-white/5 text-zinc-500'
              }`}
            >
              <span>{n}</span>
              <span>{label}</span>
            </div>
            {i < arr.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Step 1: Recipients */}
      {step === 1 && (
        <div>
          {/* Source tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-[#111111] border border-white/5 w-fit mb-5">
            {(['leads', 'submissions'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setSource(s); setSelectedIds(new Set()) }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  source === s ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {s === 'leads' ? `Leads (${leads.filter((l) => l.email).length})` : `Submissions (${submissions.filter((s) => s.email).length})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <input
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                placeholder="Filter recipients..."
                className="w-64 pl-4 pr-4 py-2 rounded-xl bg-[#111111] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={selectedIds.size === allRecipients.length && allRecipients.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 accent-violet-500"
              />
              <span>Select all ({allRecipients.length})</span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto mb-6">
            {allRecipients.map((r) => (
              <label
                key={r.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  selectedIds.has(r.id)
                    ? 'bg-violet-500/10 border-violet-500/30'
                    : 'bg-[#111111] border-white/5 hover:border-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(r.id)}
                  onChange={() => toggleId(r.id)}
                  className="w-4 h-4 accent-violet-500 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{nameOf(r)}</div>
                  <div className="text-xs text-zinc-500 truncate">{r.email} {r.company ? `· ${r.company}` : ''}</div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm transition-all"
          >
            Next: Compose
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Compose */}
      {step === 2 && (
        <div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Subject line</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject — supports {{name}}, {{company}}"
                  className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">
                  Body — use <code className="text-violet-400">{'{{name}}'}</code> and <code className="text-violet-400">{'{{company}}'}</code> for personalization
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  placeholder="Hi {{name}},&#10;&#10;I noticed your ecommerce brand {{company}} and wanted to reach out..."
                  className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 resize-none font-mono"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/5">
              <div className="text-xs text-zinc-500 mb-4 uppercase tracking-wider">Preview (first recipient)</div>
              <div className="text-sm font-semibold text-white mb-3">
                {subject.replace(/\{\{name\}\}/g, nameOf(allRecipients[0] ?? { first_name: 'John', last_name: '' }) as string).replace(/\{\{company\}\}/g, (allRecipients[0] as Lead)?.company ?? 'Acme') || <span className="text-zinc-600">No subject</span>}
              </div>
              <div className="text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
                {previewBody || <span className="text-zinc-600">No body</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <button
              onClick={send}
              disabled={sending || !subject || !body}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-sm transition-all"
            >
              <Send size={14} />
              {sending ? 'Sending...' : `Send to ${selectedIds.size} recipient${selectedIds.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && result && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Campaign Sent!</h2>
          <p className="text-zinc-400 mb-8">
            {result.sent} sent successfully · {result.failed} failed · {result.total} total
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all"
          >
            Send Another Campaign
          </button>
        </div>
      )}
    </div>
  )
}
