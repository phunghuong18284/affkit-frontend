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
        fullName: payload.fullName ?? payload.email,
        plan: payload.plan ?? 'FREE',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
      login(user, accessToken)
      router.push(redirectTo)
    },
    onError: (error: any) => {
      console.log('login error:', JSON.stringify(error))
      const code = error?.code
      if (code === 'ACCOUNT_LOCKED') {
        toast.error('Tài khoản tạm thời bị khóa. Thử lại sau.')
      } else if (code === 'ACCOUNT_NOT_VERIFIED') {
        toast.error('Email chưa được xác nhận.')
        router.push('/resend-verification')
      } else {
        toast.error('Sai email hoặc mật khẩu')
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: { email: string; fullName: string; password: string }) =>
      api.post('/auth/register', data),
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Đăng ký thất bại')
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