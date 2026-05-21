// types/user.ts

export interface UserProfile {
  id: string
  email: string
  fullName: string
  plan: 'FREE' | 'PRO' | 'BUSINESS'
  emailVerified: boolean
  createdAt: string
  linksUsed: number
  linksLimit: number
  hasAccessTradeKey: boolean
  planStartedAt: string | null
  planExpiresAt: string | null

  // Quota mới
  dealPostUsed: number
  dealPostLimit: number
  telegramConvertUsed: number
  telegramConvertLimit: number
}

export interface UpdateProfileRequest {
  fullName: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}