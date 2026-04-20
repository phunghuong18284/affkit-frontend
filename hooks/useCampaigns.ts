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

// ── Query Keys ─────────────────────────────────────
export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => ['campaigns', 'list'] as const,
}

// ── Hooks ──────────────────────────────────────────
export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: async () => {
      const res = await api.get('/campaigns')
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
      toast.success('Tạo campaign thành công!')
    },
    onError: () => {
      toast.error('Tạo campaign thất bại. Vui lòng thử lại.')
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
      toast.success('Đã xóa campaign')
    },
    onError: () => {
      toast.error('Xóa campaign thất bại')
    },
  })
}