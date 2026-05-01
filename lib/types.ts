export interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  website: string | null
  service: string | null
  budget: string | null
  message: string | null
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

export interface Lead {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  title: string | null
  linkedin_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  website: string | null
  phone: string | null
  industry: string | null
  employees: string | null
  location: string | null
  status: 'new' | 'contacted' | 'email_sent' | 'qualified' | 'closed'
  notes: string | null
  source: string
  created_at: string
}


export interface DashboardStats {
  totalSubmissions: number
  newThisWeek: number
  totalLeads: number
  viewsToday: number
  viewsThisWeek: number
}

export interface AnalyticsData {
  totalViews: number
  todayViews: number
  weekViews: number
  topPages: { page: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
}
