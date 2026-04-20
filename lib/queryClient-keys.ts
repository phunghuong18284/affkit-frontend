// =============================================================================
// lib/queryClient.ts
// =============================================================================

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30 giây
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

// =============================================================================
// lib/queryKeys.ts
// =============================================================================

import { LinkListParams, CampaignListParams } from '@/types/link'

export const queryKeys = {
  // User
  me: ['me'] as const,

  // Links
  links: {
    all: ['links'] as const,
    list: (params: LinkListParams) => ['links', 'list', params] as const,
    detail: (id: string) => ['links', id] as const,
  },

  // Analytics
  analytics: {
    overview: (period: string) => ['analytics', 'overview', period] as const,
    link: (id: string, period: string) => ['analytics', 'link', id, period] as const,
    topLinks: (period: string) => ['analytics', 'top', period] as const,
  },

  // Campaigns
  campaigns: {
    all: ['campaigns'] as const,
    list: (params: CampaignListParams) => ['campaigns', 'list', params] as const,
    detail: (id: string) => ['campaigns', id] as const,
  },
}
