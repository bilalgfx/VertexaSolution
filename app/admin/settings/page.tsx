'use client'

import { useEffect, useState } from 'react'
import { Save, Clock } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type DayConfig = {
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

const defaults: DayConfig[] = DAYS.map((_, i) => ({
  day_of_week: i,
  start_time: '09:00',
  end_time: '17:00',
  is_active: i >= 1 && i <= 5, // Mon-Fri active by default
}))

export default function SettingsPage() {
  const [days, setDays] = useState<DayConfig[]>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings/availability')
      .then((r) => r.json())
      .then((data: DayConfig[]) => {
        if (data && data.length === 7) setDays(data.sort((a, b) => a.day_of_week - b.day_of_week))
        else if (data && data.length > 0) {
          // Merge fetched data over defaults
          setDays(
            defaults.map((d) => {
              const match = data.find((x) => x.day_of_week === d.day_of_week)
              return match ?? d
            })
          )
        }
      })
      .catch(() => {})
  }, [])

  const update = (i: number, field: keyof DayConfig, value: string | boolean) => {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)))
  }

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/settings/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(days),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-zinc-500 text-sm">Configure your weekly availability for the AI call agent to book meetings.</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={16} className="text-violet-400" />
          <h2 className="font-semibold text-white">Weekly Availability</h2>
        </div>

        <div className="space-y-3">
          {days.map((day, i) => (
            <div key={day.day_of_week} className="flex items-center gap-4">
              {/* Toggle */}
              <button
                onClick={() => update(i, 'is_active', !day.is_active)}
                className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                  day.is_active ? 'bg-violet-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    day.is_active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Day name */}
              <span
                className={`w-24 text-sm font-medium ${
                  day.is_active ? 'text-white' : 'text-zinc-600'
                }`}
              >
                {DAYS[day.day_of_week]}
              </span>

              {/* Time range */}
              <div className={`flex items-center gap-2 flex-1 ${!day.is_active ? 'opacity-40 pointer-events-none' : ''}`}>
                <input
                  type="time"
                  value={day.start_time}
                  onChange={(e) => update(i, 'start_time', e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
                <span className="text-zinc-600 text-sm">to</span>
                <input
                  type="time"
                  value={day.end_time}
                  onChange={(e) => update(i, 'end_time', e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold text-sm transition-all"
      >
        <Save size={14} />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Availability'}
      </button>
    </div>
  )
}
