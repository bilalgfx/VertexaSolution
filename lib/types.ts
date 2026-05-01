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
