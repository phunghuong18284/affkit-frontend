import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'

export interface LinkResponse {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  title: string | null
  platform: string | null
  tags: string[]
  campaignId: string | null
  affiliateUrl: string | null
  totalClicks: number
  isDeleted: boolean
  createdAt: string
}

interface CreateLinkRequest {
  originalUrl: string
  title?: string
  tags?: string[]
  campaignId?: string | null
  affiliateUrl?: string
}

interface UpdateLinkRequest {
  originalUrl?: string
  title?: string
  tags?: string[]
  campaignId?: string | null
}

interface LinkListParams {
  page?: number
  size?: number
  search?: string
}

export const linkKeys = {
  all: ['links'] as const,
  list: (params: LinkListParams) => ['links', 'list', params] as const,
}

export function useLinks(params: LinkListParams = {}) {
  return useQuery({
    queryKey: linkKeys.list(params),
    queryFn: async () => {
      const res = await api.get('/links', { params })
      return res.data ?? res
    },
    staleTime: 30_000,
  })
}

export function useCreateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateLinkRequest) => {
      const res = await api.post('/links', data)
      return res.data ?? res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.all, refetchType: 'none' })
      queryClient.invalidateQueries({ queryKey: ['profile'], refetchType: 'none' })
      toast.success('Tạo link thành công!')
    },
    onError: (err: any) => {
      const msg = err?.message ?? 'Tạo link thất bại. Vui lòng thử lại.'
      toast.error(msg)
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/links/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.all })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Đã xóa link')
    },
    onError: () => {
      toast.error('Xóa link thất bại')
    },
  })
}

export function useUpdateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLinkRequest }) => {
      const res = await api.patch(`/links/${id}`, data)
      return res.data ?? res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.all })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Cập nhật link thành công!')
    },
    onError: () => {
      toast.error('Cập nhật link thất bại. Vui lòng thử lại.')
    },
  })
}