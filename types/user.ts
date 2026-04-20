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
}

export interface UpdateProfileRequest {
  fullName: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}