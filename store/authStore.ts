import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  fullName: string
  plan: 'FREE' | 'PRO' | 'BUSINESS'
  isVerified: boolean
  createdAt: string
  stats?: {
    totalLinks: number
    totalClicks: number
    linkLimit: number
    clickLimitMonthly: number
    clicksThisMonth: number
  }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean                           // 👈 thêm

  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setHasHydrated: (state: boolean) => void        // 👈 thêm
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,                        // 👈 thêm

      setHasHydrated: (state) => set({ _hasHydrated: state }), // 👈 thêm
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),

      login: (user, token) => set({
        user,
        accessToken: token,
        isAuthenticated: true,
      }),

      logout: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'affkit-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {      // 👈 thêm
        state?.setHasHydrated(true)
      },
    }
  )
)