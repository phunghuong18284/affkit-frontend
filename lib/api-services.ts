// =============================================================================
// lib/api/auth.ts
// =============================================================================

import api from '@/lib/api'
import {
  LoginRequest, LoginResponse, RegisterRequest,
  RefreshResponse, VerifyEmailResponse, ResetPasswordRequest
} from '@/types/auth'

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<void>('/auth/register', data),

  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/auth/login', data),

  logout: () =>
    api.post<void>('/auth/logout'),

  refresh: (): Promise<RefreshResponse> =>
    api.post('/auth/refresh'),

  verifyEmail: (token: string): Promise<VerifyEmailResponse> =>
    api.get(`/auth/verify-email?token=${token}`),

  resendVerification: (email: string) =>
    api.post<void>('/auth/resend-verification', { email }),

  forgotPassword: (email: string) =>
    api.post<void>('/auth/forgot-password', { email }),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<void>('/auth/reset-password', data),
}

// =============================================================================
// lib/api/links.ts
// =============================================================================

import { LinkResponse, CreateLinkRequest, UpdateLinkRequest, LinkListParams } from '@/types/link'
import { PageResponse } from '@/types/api'

export const linksApi = {
  list: (params: LinkListParams): Promise<PageResponse<LinkResponse>> =>
    api.get('/links', { params }),

  create: (data: CreateLinkRequest): Promise<LinkResponse> =>
    api.post('/links', data),

  get: (id: string): Promise<LinkResponse> =>
    api.get(`/links/${id}`),

  update: (id: string, data: UpdateLinkRequest): Promise<LinkResponse> =>
    api.patch(`/links/${id}`, data),

  delete: (id: string): Promise<void> =>
    api.delete(`/links/${id}`),
}

// =============================================================================
// lib/api/analytics.ts
// =============================================================================

import {
  AnalyticsOverview, LinkAnalytics, TopLink,
  AnalyticsPeriodParams, TopLinksParams
} from '@/types/analytics-campaign'

export const analyticsApi = {
  overview: (params: AnalyticsPeriodParams): Promise<AnalyticsOverview> =>
    api.get('/analytics/overview', { params }),

  linkDetail: (id: string, params: AnalyticsPeriodParams): Promise<LinkAnalytics> =>
    api.get(`/analytics/links/${id}`, { params }),

  topLinks: (params: TopLinksParams): Promise<TopLink[]> =>
    api.get('/analytics/top-links', { params }),
}

// =============================================================================
// lib/api/campaigns.ts
// =============================================================================

import {
  CampaignResponse, CampaignDetailResponse,
  CreateCampaignRequest, UpdateCampaignRequest, CampaignListParams
} from '@/types/analytics-campaign'

export const campaignsApi = {
  list: (params: CampaignListParams): Promise<PageResponse<CampaignResponse>> =>
    api.get('/campaigns', { params }),

  create: (data: CreateCampaignRequest): Promise<CampaignResponse> =>
    api.post('/campaigns', data),

  get: (id: string): Promise<CampaignDetailResponse> =>
    api.get(`/campaigns/${id}`),

  update: (id: string, data: UpdateCampaignRequest): Promise<CampaignResponse> =>
    api.patch(`/campaigns/${id}`, data),

  delete: (id: string): Promise<void> =>
    api.delete(`/campaigns/${id}`),
}
