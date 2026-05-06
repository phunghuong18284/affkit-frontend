//ts-nocheck
// =============================================================================
// hooks/useAuth.ts
// =============================================================================

'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { LoginInput, RegisterInput } from '@/lib/validators'
import { ApiError } from '@/types/api'
import { getErrorMessage } from '@/lib/queryClient'

export function useAuth() {
  const { user, accessToken, login, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken)
      router.push('/dashboard')
    },
    onError: (error: ApiError) => {
      if (error.code === 'ACCOUNT_LOCKED') {
        const sec = (error.details?.remainingSeconds as number) ?? 60
        toast.error(`Tài khoản tạm thời bị khóa. Thử lại sau ${sec}s`)
      } else if (error.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Email chưa xác nhận. Đang chuyển hướng...')
        router.push('/resend-verification')
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
      router.push('/login')
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error))
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      queryClient.clear()
      router.push('/login')
    },
  })

  return {
    user,
    isAuthenticated: !!accessToken,
    isPro: user?.plan === 'PRO' || user?.plan === 'BUSINESS',

    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}

// =============================================================================
// hooks/useLinks.ts
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { linksApi } from '@/lib/api/links'
import { queryKeys } from '@/lib/queryKeys'
import { LinkListParams, UpdateLinkRequest } from '@/types/link'

export function useLinks(params: LinkListParams = {}) {
  return useQuery({
    queryKey: queryKeys.links.list(params),
    queryFn: () => linksApi.list(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}

export function useLink(id: string) {
  return useQuery({
    queryKey: queryKeys.links.detail(id),
    queryFn: () => linksApi.get(id),
    enabled: !!id,
  })
}

export function useCreateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: linksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.me })
      toast.success('Link đã được tạo thành công!')
    },
    onError: (error: ApiError) => {
      if (error.code === 'LINK_LIMIT_EXCEEDED') {
        toast.error('Đã đạt giới hạn 10 links. Nâng cấp Pro để tạo thêm.')
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })
}

export function useUpdateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkRequest }) =>
      linksApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all })
      queryClient.setQueryData(queryKeys.links.detail(updated.id), updated)
      toast.success('Link đã được cập nhật!')
    },
    onError: () => toast.error('Cập nhật link thất bại'),
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: linksApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all })
      queryClient.removeQueries({ queryKey: queryKeys.links.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.me })
      toast.success('Link đã được xóa')
    },
    onError: () => toast.error('Xóa link thất bại'),
  })
}

// =============================================================================
// hooks/useAnalytics.ts
// =============================================================================

import { analyticsApi } from '@/lib/api/analytics'

export function useAnalyticsOverview(period: string) {
  return useQuery({
    queryKey: queryKeys.analytics.overview(period),
    queryFn: () => analyticsApi.overview({ period }),
    staleTime: 5 * 60_000,
    retry: 1,
  })
}

export function useLinkAnalytics(id: string, period: string) {
  return useQuery({
    queryKey: queryKeys.analytics.link(id, period),
    queryFn: () => analyticsApi.linkDetail(id, { period }),
    enabled: !!id,
    staleTime: 5 * 60_000,
  })
}

export function useTopLinks(period: string, limit = 5) {
  return useQuery({
    queryKey: queryKeys.analytics.topLinks(period),
    queryFn: () => analyticsApi.topLinks({ period, limit }),
    staleTime: 5 * 60_000,
  })
}

// =============================================================================
// hooks/useCampaigns.ts
// =============================================================================

import { campaignsApi } from '@/lib/api/campaigns'
import { CampaignListParams, UpdateCampaignRequest } from '@/types/analytics-campaign'

export function useCampaigns(params: CampaignListParams = {}) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(params),
    queryFn: () => campaignsApi.list(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: campaignsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all })
      toast.success('Campaign đã được tạo!')
    },
    onError: () => toast.error('Tạo campaign thất bại'),
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignRequest }) =>
      campaignsApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all })
      queryClient.setQueryData(queryKeys.campaigns.detail(updated.id), updated)
      toast.success('Campaign đã được cập nhật!')
    },
    onError: () => toast.error('Cập nhật campaign thất bại'),
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: campaignsApi.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all })
      queryClient.removeQueries({ queryKey: queryKeys.campaigns.detail(id) })
      toast.success('Campaign đã được xóa')
    },
    onError: () => toast.error('Xóa campaign thất bại'),
  })
}

// =============================================================================
// hooks/useCopyToClipboard.ts
// =============================================================================

import { useState, useCallback } from 'react'

export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Đã sao chép link!')
      setTimeout(() => setCopied(false), timeout)
    } catch {
      toast.error('Không thể sao chép. Vui lòng copy thủ công.')
    }
  }, [timeout])

  return { copy, copied }
}
