import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useAuthStore } from '@/store/authStore'

// Mock sessionStorage cho jsdom
const mockStorage: Record<string, string> = {}
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value },
    removeItem: (key: string) => { delete mockStorage[key] },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]) },
  },
  writable: true,
})

const mockUser = {
  id: 'user-uuid-123',
  email: 'test@gmail.com',
  fullName: 'Nguyen Van A',
  plan: 'FREE' as const,
  isVerified: true,
  createdAt: '2026-04-01T00:00:00Z',
}

describe('authStore', () => {
  beforeEach(() => {
    // Reset store về trạng thái ban đầu trước mỗi test
    act(() => {
      useAuthStore.setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        _hasHydrated: false,
      })
    })
    Object.keys(mockStorage).forEach(k => delete mockStorage[k])
  })

  // =========================================================
  // login()
  // =========================================================

  describe('login()', () => {
    it('✅ login thành công → set user + accessToken + isAuthenticated=true', () => {
      act(() => {
        useAuthStore.getState().login(mockUser, 'access_token_xyz')
      })

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.accessToken).toBe('access_token_xyz')
      expect(state.isAuthenticated).toBe(true)
    })

    it('✅ login với plan PRO → isPro đúng', () => {
      const proUser = { ...mockUser, plan: 'PRO' as const }
      act(() => {
        useAuthStore.getState().login(proUser, 'token_pro')
      })

      const state = useAuthStore.getState()
      expect(state.user?.plan).toBe('PRO')
    })
  })

  // =========================================================
  // logout()
  // =========================================================

  describe('logout()', () => {
    it('✅ logout → clear user + accessToken + isAuthenticated=false', () => {
      // Login trước
      act(() => {
        useAuthStore.getState().login(mockUser, 'access_token_xyz')
      })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Logout
      act(() => {
        useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('✅ logout khi chưa login → không throw', () => {
      expect(() => {
        act(() => {
          useAuthStore.getState().logout()
        })
      }).not.toThrow()
    })
  })

  // =========================================================
  // setAccessToken()
  // =========================================================

  describe('setAccessToken()', () => {
    it('✅ set token mới → cập nhật accessToken', () => {
      act(() => {
        useAuthStore.getState().setAccessToken('new_token_abc')
      })

      expect(useAuthStore.getState().accessToken).toBe('new_token_abc')
    })
  })

  // =========================================================
  // setUser()
  // =========================================================

  describe('setUser()', () => {
    it('✅ setUser → cập nhật user', () => {
      act(() => {
        useAuthStore.getState().setUser(mockUser)
      })

      expect(useAuthStore.getState().user).toEqual(mockUser)
    })
  })

  // =========================================================
  // updateUser()
  // =========================================================

  describe('updateUser()', () => {
    it('✅ updateUser → merge partial update', () => {
      act(() => {
        useAuthStore.getState().login(mockUser, 'token')
        useAuthStore.getState().updateUser({ fullName: 'Ten Moi' })
      })

      const state = useAuthStore.getState()
      expect(state.user?.fullName).toBe('Ten Moi')
      // Các field khác không thay đổi
      expect(state.user?.email).toBe('test@gmail.com')
      expect(state.user?.plan).toBe('FREE')
    })

    it('✅ updateUser khi user=null → không throw, user vẫn null', () => {
      expect(() => {
        act(() => {
          useAuthStore.getState().updateUser({ fullName: 'Ten Moi' })
        })
      }).not.toThrow()

      expect(useAuthStore.getState().user).toBeNull()
    })
  })

  // =========================================================
  // _hasHydrated / setHasHydrated()
  // =========================================================

  describe('hydration', () => {
    it('✅ ban đầu _hasHydrated=false', () => {
      expect(useAuthStore.getState()._hasHydrated).toBe(false)
    })

    it('✅ setHasHydrated(true) → _hasHydrated=true', () => {
      act(() => {
        useAuthStore.getState().setHasHydrated(true)
      })

      expect(useAuthStore.getState()._hasHydrated).toBe(true)
    })
  })

  // =========================================================
  // isAuthenticated logic
  // =========================================================

  describe('isAuthenticated', () => {
    it('✅ trước khi login → isAuthenticated=false', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('✅ sau login → isAuthenticated=true', () => {
      act(() => {
        useAuthStore.getState().login(mockUser, 'token')
      })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('✅ sau logout → isAuthenticated=false', () => {
      act(() => {
        useAuthStore.getState().login(mockUser, 'token')
        useAuthStore.getState().logout()
      })
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
