// =============================================================================
// types/auth.ts
// =============================================================================

export interface User {
  id: string
  email: string
  fullName: string
  plan: 'FREE' | 'PRO' | 'BUSINESS'
  isVerified: boolean
  createdAt: string
  stats?: UserStats
}

export interface UserStats {
  totalLinks: number
  totalClicks: number
  linkLimit: number
  clickLimitMonthly: number
  clicksThisMonth: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  fullName: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface RefreshResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface VerifyEmailResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}
