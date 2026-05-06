import { createClient } from '@supabase/supabase-js'

type DB = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string; name: string; email: string; company: string | null
          website: string | null; service: string | null; budget: string | null
          message: string | null; phone: string | null
          status: 'new' | 'contacted' | 'closed'; created_at: string
        }
        Insert: {
          id?: string; name: string; email: string; company?: string | null
          website?: string | null; service?: string | null; budget?: string | null
          message?: string | null; phone?: string | null
          status?: 'new' | 'contacted' | 'closed'; created_at?: string
        }
        Update: {
          id?: string; name?: string; email?: string; company?: string | null
          website?: string | null; service?: string | null; budget?: string | null
          message?: string | null; phone?: string | null
          status?: 'new' | 'contacted' | 'closed'; created_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string; first_name: string | null; last_name: string | null
          email: string | null; company: string | null; title: string | null
          linkedin_url: string | null; phone: string | null; industry: string | null
          employees: string | null; location: string | null
          status: 'new' | 'contacted' | 'qualified' | 'closed'
          notes: string | null; source: string; created_at: string
        }
        Insert: {
          id?: string; first_name?: string | null; last_name?: string | null
          email?: string | null; company?: string | null; title?: string | null
          linkedin_url?: string | null; phone?: string | null; industry?: string | null
          employees?: string | null; location?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'closed'
          notes?: string | null; source?: string; created_at?: string
        }
        Update: {
          id?: string; first_name?: string | null; last_name?: string | null
          email?: string | null; company?: string | null; title?: string | null
          linkedin_url?: string | null; phone?: string | null; industry?: string | null
          employees?: string | null; location?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'closed'
          notes?: string | null; source?: string; created_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: { id: string; page: string; referrer: string | null; created_at: string }
        Insert: { id?: string; page: string; referrer?: string | null; created_at?: string }
        Update: { id?: string; page?: string; referrer?: string | null; created_at?: string }
        Relationships: []
      }
      admin_availability: {
        Row: { id: string; day_of_week: number; start_time: string; end_time: string; is_active: boolean }
        Insert: { id?: string; day_of_week: number; start_time: string; end_time: string; is_active?: boolean }
        Update: { id?: string; day_of_week?: number; start_time?: string; end_time?: string; is_active?: boolean }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string; submission_id: string | null; contact_name: string | null
          contact_email: string | null; contact_phone: string | null
          scheduled_date: string; scheduled_time: string
          status: 'confirmed' | 'cancelled'; notes: string | null
          call_transcript: string | null; created_at: string
        }
        Insert: {
          id?: string; submission_id?: string | null; contact_name?: string | null
          contact_email?: string | null; contact_phone?: string | null
          scheduled_date: string; scheduled_time: string
          status?: 'confirmed' | 'cancelled'; notes?: string | null
          call_transcript?: string | null; created_at?: string
        }
        Update: {
          id?: string; submission_id?: string | null; contact_name?: string | null
          contact_email?: string | null; contact_phone?: string | null
          scheduled_date?: string; scheduled_time?: string
          status?: 'confirmed' | 'cancelled'; notes?: string | null
          call_transcript?: string | null; created_at?: string
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          id: string; subject: string; body: string
          recipient_count: number; status: 'sent' | 'failed'; sent_at: string
        }
        Insert: {
          id?: string; subject: string; body: string
          recipient_count?: number; status?: 'sent' | 'failed'; sent_at?: string
        }
        Update: {
          id?: string; subject?: string; body?: string
          recipient_count?: number; status?: 'sent' | 'failed'; sent_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

let _admin: ReturnType<typeof createClient<DB>> | null = null

export function getAdminClient() {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase env vars not configured')
    _admin = createClient<DB>(url, key)
  }
  return _admin
}
