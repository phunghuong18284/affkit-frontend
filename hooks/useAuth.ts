'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

export function useAuth(redirectTo: string = '/dashboard') {
  const { user, accessToken, login, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/auth/login', data),
    onSuccess: (data: any) => {
      const accessToken = data?.accessToken

      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const user = {
        id: payload.sub,
        email: payload.email,
        fullName: payload.email,
        plan: payload.plan ?? 'FREE',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
      login(user, accessToken)
      router.push(redirectTo)
    },
    onError: (error: any) => {
      const code = error?.code
      if (code === 'ACCOUNT_LOCKED') {
        toast.error('Tai khoan tam thoi bi khoa. Thu lai sau.')
      } else if (code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Email chua xac nhan.')
        router.push('/resend-verification')
      } else {
        toast.error('Sai email hoac mat khau')
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: { email: string; fullName: string; password: string }) =>
      api.post('/auth/register', data),
    onSuccess: () => {
      toast.success('Dang ky thanh cong! Vui long kiem tra email.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Dang ky that bai')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
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