// =============================================================================
// types/analytics.ts
// =============================================================================

export type AnalyticsPeriod = 'today' | '7d' | '30d' | '90d' | 'custom'
export type TrafficSource = 'ZALO' | 'TELEGRAM' | 'FACEBOOK' | 'DIRECT' | 'OTHER'
export type DeviceType = 'MOBILE' | 'DESKTOP' | 'TABLET' | 'OTHER'

export interface ClickByDay {
  date: string
  clicks: number
}

export interface ClickByHour {
  hour: number
  clicks: number
}

export interface SourceBreakdown {
  source: TrafficSource
  clicks: number
  percentage: number
}

export interface DeviceBreakdown {
  device: DeviceType
  clicks: number
  percentage: number
}

export interface AnalyticsOverview {
  period: { label: string; from: string; to: string }
  summary: {
    totalClicks: number
    totalLinks: number
    activeLinks: number
    topSource: TrafficSource
    peakHour: number
    growthPercent: number
  }
  clicksByDay: ClickByDay[]
  sourceBreakdown: SourceBreakdown[]
  deviceBreakdown: DeviceBreakdown[]
  clicksByHour: ClickByHour[]
}

export interface LinkAnalytics {
  link: {
    id: string
    shortCode: string
    shortUrl: string
    originalUrl: string
    title: string | null
    platform: string
    createdAt: string
  }
  period: { label: string; from: string; to: string }
  summary: {
    totalClicks: number
    uniqueClicks: number
    clicksToday: number
    clicksThisWeek: number
    peakHour: number
    topSource: TrafficSource
  }
  clicksByDay: ClickByDay[]
  clicksByHour: ClickByHour[]
  sourceBreakdown: SourceBreakdown[]
  deviceBreakdown: DeviceBreakdown[]
}

export interface TopLink {
  linkId: string
  shortCode: string
  shortUrl: string
  title: string | null
  platform: string
  totalClicks: number
  rank: number
}

export interface AnalyticsPeriodParams {
  period: string
  from?: string
  to?: string
}

export interface TopLinksParams {
  period: string
  limit?: number
}

// =============================================================================
// types/campaign.ts
// =============================================================================

export type CampaignStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED'

export interface CampaignResponse {
  id: string
  name: string
  description: string | null
  startDate: string | null
  endDate: string | null
  status: CampaignStatus
  isArchived: boolean
  linkCount: number
  totalClicks: number
  createdAt: string
  updatedAt: string
}

export interface CampaignDetailResponse extends CampaignResponse {
  links: CampaignLinkSummary[]
}

export interface CampaignLinkSummary {
  id: string
  shortCode: string
  shortUrl: string
  title: string | null
  platform: string
  clickCount: number
}

export interface CreateCampaignRequest {
  name: string
  description?: string
  startDate?: string
  endDate?: string
}

export interface UpdateCampaignRequest {
  name?: string
  description?: string
  startDate?: string | null
  endDate?: string | null
}

export interface CampaignListParams {
  page?: number
  size?: number
  status?: CampaignStatus
  search?: string
}
