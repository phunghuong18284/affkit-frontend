import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'

// ── Types ──────────────────────────────────────────
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
}

interface CreateCampaignRequest {
  name: string
  description?: string
  startDate?: string | null
  endDate?: string | null
}

interface CampaignListParams {
  page?: number
  size?: number
}

// ── Query Keys ─────────────────────────────────────
export const campaignKeys = {
  all: ['campaigns'] as const,
  list: (params?: CampaignListParams) => ['campaigns', 'list', params] as const,
}

// ── Hooks ──────────────────────────────────────────
export function useCampaigns(params: CampaignListParams = {}) {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: async () => {
      const res = await api.get('/campaigns', { params })
      return res.data ?? res
    },
    staleTime: 30_000,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      const res = await api.post('/campaigns', data)
      return res.data ?? res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all })
      toast.success('Tao campaign thanh cong!')
    },
    onError: () => {
      toast.error('Tao campaign that bai. Vui long thu lai.')
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCampaignRequest> }) => {
      const res = await api.patch(`/campaigns/${id}`, data)
      return res.data ?? res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all })
      toast.success('Cap nhat campaign thanh cong!')
    },
    onError: () => {
      toast.error('Cap nhat campaign that bai.')
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/campaigns/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all })
      toast.success('Da xoa campaign')
    },
    onError: () => {
      toast.error('Xoa campaign that bai')
    },
  })
}