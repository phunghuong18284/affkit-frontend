import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// ── Mock next/navigation ──────────────────────────────────
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// ── Mock sonner toast ─────────────────────────────────────
const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (msg: string) => mockToastSuccess(msg),
    error: (msg: string) => mockToastError(msg),
  },
}))

// ── Mock api ──────────────────────────────────────────────
const mockApiPost = vi.fn()
vi.mock('@/lib/api', () => ({
  default: { post: (...args: any[]) => mockApiPost(...args) },
}))

// ── Mock authStore ────────────────────────────────────────
const mockLogin = vi.fn()
const mockLogout = vi.fn()
let mockAccessToken: string | null = null
let mockUser: any = null

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    accessToken: mockAccessToken,
    login: mockLogin,
    logout: mockLogout,
  }),
}))

import { useAuth } from '@/hooks/useAuth'

// ── Helper: JWT payload giả ───────────────────────────────
function makeJwt(payload: object): string {
  const encoded = btoa(JSON.stringify(payload))
  return `header.${encoded}.signature`
}

// ── Wrapper với QueryClientProvider ──────────────────────
function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAccessToken = null
    mockUser = null
  })

  // =========================================================
  // isAuthenticated
  // =========================================================

  describe('isAuthenticated', () => {
    it('✅ không có accessToken → isAuthenticated=false', () => {
      mockAccessToken = null
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('✅ có accessToken → isAuthenticated=true', () => {
      mockAccessToken = 'some_token'
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  // =========================================================
  // isPro
  // =========================================================

  describe('isPro', () => {
    it('✅ plan FREE → isPro=false', () => {
      mockUser = { plan: 'FREE' }
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isPro).toBe(false)
    })

    it('✅ plan PRO → isPro=true', () => {
      mockUser = { plan: 'PRO' }
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isPro).toBe(true)
    })

    it('✅ plan BUSINESS → isPro=true', () => {
      mockUser = { plan: 'BUSINESS' }
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isPro).toBe(true)
    })

    it('✅ user null → isPro=false', () => {
      mockUser = null
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isPro).toBe(false)
    })
  })

  // =========================================================
  // login mutation
  // =========================================================

  describe('login()', () => {
    it('✅ login thành công → decode JWT + gọi login store + router.push', async () => {
      const jwtPayload = {
        sub: 'user-uuid-123',
        email: 'test@gmail.com',
        plan: 'FREE',
      }
      const fakeToken = makeJwt(jwtPayload)

      mockApiPost.mockResolvedValueOnce({ accessToken: fakeToken })

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.login({ email: 'test@gmail.com', password: 'Pass123' })
      })

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'user-uuid-123',
            email: 'test@gmail.com',
            plan: 'FREE',
          }),
          fakeToken
        )
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('✅ login thành công → redirect đến custom redirectTo', async () => {
      const fakeToken = makeJwt({ sub: 'uid', email: 'a@b.com', plan: 'FREE' })
      mockApiPost.mockResolvedValueOnce({ accessToken: fakeToken })

      const { result } = renderHook(() => useAuth('/custom-path'), {
        wrapper: makeWrapper(),
      })

      await act(async () => {
        result.current.login({ email: 'a@b.com', password: 'Pass123' })
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-path')
      })
    })

    it('❌ login lỗi ACCOUNT_LOCKED → toast locked', async () => {
      mockApiPost.mockRejectedValueOnce({ code: 'ACCOUNT_LOCKED' })

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.login({ email: 'locked@gmail.com', password: 'Pass123' })
      })

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          expect.stringContaining('khoa')
        )
        expect(mockLogin).not.toHaveBeenCalled()
      })
    })

    it('❌ login lỗi EMAIL_NOT_VERIFIED → redirect resend-verification', async () => {
      mockApiPost.mockRejectedValueOnce({ code: 'EMAIL_NOT_VERIFIED' })

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.login({ email: 'unverified@gmail.com', password: 'Pass123' })
      })

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/resend-verification')
      })
    })

    it('❌ login lỗi generic → toast sai email/mật khẩu', async () => {
      mockApiPost.mockRejectedValueOnce({ code: 'INVALID_CREDENTIALS' })

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.login({ email: 'wrong@gmail.com', password: 'wrong' })
      })

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          expect.stringContaining('email')
        )
      })
    })
  })

  // =========================================================
  // register mutation
  // =========================================================

  describe('register()', () => {
    it('✅ register thành công → toast success + redirect /login', async () => {
      mockApiPost.mockResolvedValueOnce({ message: 'ok' })

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.register({
          email: 'new@gmail.com',
          fullName: 'Nguyen Van B',
          password: 'Password123',
        })
      })

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('❌ register thất bại → toast error', async () => {
      mockApiPost.mockRejectedValueOnce({ message: 'Email da ton tai' })

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.register({
          email: 'existing@gmail.com',
          fullName: 'Nguyen Van C',
          password: 'Password123',
        })
      })

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalledWith('/login')
      })
    })
  })

  // =========================================================
  // logout mutation
  // =========================================================

  describe('logout()', () => {
    it('✅ logout → gọi store.logout() + clear query + redirect /login', async () => {
      mockApiPost.mockResolvedValueOnce({})

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.logout()
      })

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('✅ logout dù API lỗi → vẫn gọi store.logout() (onSettled)', async () => {
      // onSettled chạy dù thành công hay thất bại
      mockApiPost.mockRejectedValueOnce(new Error('network error'))

      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })

      await act(async () => {
        result.current.logout()
      })

      await waitFor(() => {
        // onSettled luôn chạy → logout luôn được gọi
        expect(mockLogout).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })

  // =========================================================
  // loading states
  // =========================================================

  describe('loading states', () => {
    it('✅ ban đầu không có loading nào', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() })
      expect(result.current.isLoggingIn).toBe(false)
      expect(result.current.isRegistering).toBe(false)
      expect(result.current.isLoggingOut).toBe(false)
    })
  })
})
