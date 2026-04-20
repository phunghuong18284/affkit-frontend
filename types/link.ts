// =============================================================================
// types/link.ts
// =============================================================================

export type Platform = 'SHOPEE' | 'LAZADA' | 'TIKI' | 'TIKTOK' | 'OTHER'

export interface LinkResponse {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  title: string | null
  platform: Platform
  tags: string[]
  campaignId: string | null
  campaignName: string | null
  clickCount: number
  clicksToday?: number
  clicksThisWeek?: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateLinkRequest {
  originalUrl: string
  title?: string
  tags?: string[]
  campaignId?: string | null
}

export interface UpdateLinkRequest {
  title?: string
  tags?: string[]
  campaignId?: string | null
}

export interface LinkListParams {
  page?: number
  size?: number
  sortBy?: 'createdAt' | 'clickCount'
  sortDir?: 'asc' | 'desc'
  platform?: Platform
  campaignId?: string
  tag?: string
  search?: string
}
