import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export type AnalyticsPeriod = 'today' | '7d' | '30d' | '90d'

export interface AnalyticsOverview {
  summary: {
    totalClicks: number
    totalLinks: number
    activeLinks: number
    topSource: string
    growthPercent: number
  }
  clicksByDay: { date: string; clicks: number }[]
  sourceBreakdown: { source: string; clicks: number; percentage: number }[]
  deviceBreakdown: { device: string; clicks: number; percentage: number }[]
}

export const analyticsKeys = {
  overview: (period: string) => ['analytics', 'overview', period] as const,
}

export function useAnalyticsOverview(period: AnalyticsPeriod = '30d') {
  return useQuery({
    queryKey: analyticsKeys.overview(period),
    queryFn: async () => {
      const res = await api.get('/analytics/overview', { params: { period } })
      return (res.data ?? res) as AnalyticsOverview
    },
    staleTime: 5 * 60_000,
  })
}