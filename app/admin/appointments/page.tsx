'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck, Phone, Mail, Clock, X, RefreshCw } from 'lucide-react'

type Appointment = {
  id: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  scheduled_date: string
  scheduled_time: string
  status: 'confirmed' | 'cancelled'
  notes: string | null
  created_at: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/appointments')
    if (res.ok) setAppointments(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchAppointments() }, [])

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  const formatTime = (t: string) => {
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const confirmed = appointments.filter((a) => a.status === 'confirmed')
  const cancelled = appointments.filter((a) => a.status === 'cancelled')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Appointments</h1>
          <p className="text-zinc-500 text-sm">Bookings made by your AI call agent</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: appointments.length, color: 'violet' },
          { label: 'Confirmed', value: confirmed.length, color: 'green' },
          { label: 'Cancelled', value: cancelled.length, color: 'red' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-[#111111] border border-white/5">
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <CalendarCheck size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No appointments yet. They'll appear here once your AI call agent starts booking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className={`p-5 rounded-2xl border transition-all ${
                appt.status === 'confirmed'
                  ? 'bg-[#111111] border-white/5'
                  : 'bg-[#0d0d0d] border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CalendarCheck size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">
                      {appt.contact_name || 'Unknown Contact'}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatDate(appt.scheduled_date)} at {formatTime(appt.scheduled_time)}
                      </span>
                      {appt.contact_email && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} />
                          {appt.contact_email}
                        </span>
                      )}
                      {appt.contact_phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} />
                          {appt.contact_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'confirmed'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {appt.status}
                  </span>
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(appt.id, 'cancelled')}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                      title="Cancel appointment"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {appt.status === 'cancelled' && (
                    <button
                      onClick={() => updateStatus(appt.id, 'confirmed')}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
