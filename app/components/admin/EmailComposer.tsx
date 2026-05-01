'use client'

import { useState, useRef } from 'react'
import { X, Send, Paperclip, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultTo: string
  defaultToName?: string
  defaultSubject?: string
  defaultBody?: string
  showAttachment?: boolean
}

export default function EmailComposer({ isOpen, onClose, defaultTo, defaultToName, defaultSubject = '', defaultBody = '', showAttachment = false }: Props) {
  const [to, setTo] = useState(defaultTo)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState(defaultBody)
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleClose = () => {
    setError(''); setSent(false)
    onClose()
  }

  const send = async () => {
    if (!to || !subject || !body) { setError('Fill in all fields'); return }
    setSending(true); setError('')

    let attachment: { name: string; content: string } | undefined
    if (file) {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      attachment = { name: file.name, content: base64 }
    }

    const res = await fetch('/api/admin/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, toName: defaultToName, subject, body, attachment }),
    })

    const data = await res.json()
    setSending(false)

    if (!res.ok) { setError(data.error || 'Failed to send'); return }
    setSent(true)
    setTimeout(handleClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Compose Email</h2>
          <button onClick={handleClose} className="text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-3">
          {/* To */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">To</label>
            <input value={to} onChange={e => setTo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white focus:outline-none focus:border-violet-500/40 transition-all" />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="e.g. AI Automation Proposal for Your Business"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all" />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={9}
              placeholder="Write your message here..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#0d0d0d] border border-white/8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all resize-none" />
          </div>

          {/* Attachment */}
          {showAttachment && (
            <div>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden"
                onChange={e => setFile(e.target.files?.[0] || null)} />
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/10 hover:border-violet-500/30 text-zinc-500 hover:text-violet-300 text-xs transition-all">
                <Paperclip size={13} />
                {file ? file.name : 'Attach file (PDF, DOC, image)'}
              </button>
              {file && (
                <button onClick={() => setFile(null)} className="mt-1 text-xs text-zinc-600 hover:text-red-400 transition-colors">Remove attachment</button>
              )}
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle size={13} />{error}
            </div>
          )}
          {sent && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle2 size={13} />Email sent successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center justify-between">
          <p className="text-xs text-zinc-600">Sent via Brevo · 300 emails/day free</p>
          <div className="flex gap-2">
            <button onClick={handleClose} className="px-4 py-2 rounded-xl border border-white/8 text-zinc-400 hover:text-white text-sm transition-all">Cancel</button>
            <button onClick={send} disabled={sending || sent}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all">
              <Send size={13} />{sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
