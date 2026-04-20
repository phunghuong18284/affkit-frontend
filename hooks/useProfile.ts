// hooks/useProfile.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '@/types/user'

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/me')
      return res as unknown as UserProfile
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const res = await api.patch('/users/me', data)
      return res as unknown as UserProfile
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Da cap nhat thong tin')
    },
    onError: () => {
      toast.error('Cap nhat that bai')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      await api.post('/users/me/change-password', data)
    },
    onSuccess: () => {
      toast.success('Doi mat khau thanh cong')
    },
    onError: () => {
      toast.error('Mat khau hien tai khong dung')
    },
  })
}