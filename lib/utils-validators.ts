//ts-nocheck
// =============================================================================
// lib/utils.ts
// =============================================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Platform } from '@/types/link'

/** Merge Tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format số: 1234 → "1.234" */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}

/** Format ngày: "2024-01-15" → "15/01/2024" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

/** Format ngày giờ đầy đủ */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN')
}

/** Detect platform từ URL */
export function detectPlatform(url: string): Platform {
  if (!url) return 'OTHER'
  const lower = url.toLowerCase()
  if (lower.includes('shopee.vn')) return 'SHOPEE'
  if (lower.includes('lazada.vn')) return 'LAZADA'
  if (lower.includes('tiki.vn')) return 'TIKI'
  if (lower.includes('tiktok.com')) return 'TIKTOK'
  return 'OTHER'
}

/** Màu sắc theo platform */
export const PLATFORM_COLORS: Record<Platform, string> = {
  SHOPEE: '#FF6B35',
  LAZADA: '#0F146D',
  TIKI: '#1A94FF',
  TIKTOK: '#010101',
  OTHER: '#6B7280',
}

/** Label hiển thị cho platform */
export const PLATFORM_LABELS: Record<Platform, string> = {
  SHOPEE: 'Shopee',
  LAZADA: 'Lazada',
  TIKI: 'Tiki',
  TIKTOK: 'TikTok',
  OTHER: 'Khác',
}

/** Map error code → message thân thiện */
export function getErrorMessage(error: { code?: string; message?: string } | null): string {
  if (!error) return 'Đã có lỗi xảy ra'
  const messages: Record<string, string> = {
    EMAIL_ALREADY_EXISTS: 'Email này đã được đăng ký.',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    ACCOUNT_LOCKED: 'Tài khoản tạm thời bị khóa. Vui lòng thử lại sau.',
    EMAIL_NOT_VERIFIED: 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.',
    LINK_NOT_FOUND: 'Link không tồn tại.',
    LINK_LIMIT_EXCEEDED: 'Bạn đã đạt giới hạn 10 links của gói Free. Nâng cấp Pro để tạo thêm.',
    CAMPAIGN_NOT_FOUND: 'Campaign không tồn tại.',
    TOKEN_EXPIRED: 'Token đã hết hạn. Vui lòng thử lại.',
    INVALID_TOKEN: 'Token không hợp lệ.',
  }
  return messages[error.code ?? ''] ?? error.message ?? 'Đã có lỗi xảy ra'
}

// =============================================================================
// lib/constants.ts
// =============================================================================

export const PLAN_LIMITS = {
  FREE: {
    links: 10,
    clicksMonthly: 1000,
    analyticsRetentionDays: 7,
  },
  PRO: {
    links: -1,       // unlimited
    clicksMonthly: -1,
    analyticsRetentionDays: 90,
  },
}

export const PERIODS = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' },
] as const

export const PAGE_SIZE = 10

// =============================================================================
// lib/validators.ts
// =============================================================================

import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email không đúng định dạng').max(255),
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(255),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[a-zA-Z]/, 'Mật khẩu phải có chữ')
    .regex(/[0-9]/, 'Mật khẩu phải có số'),
})

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export const createLinkSchema = z.object({
  originalUrl: z.string().url('URL không hợp lệ').max(2048, 'URL quá dài'),
  title: z.string().max(255).optional(),
  tags: z.array(z.string().max(50).min(1)).max(5, 'Tối đa 5 tags').optional(),
  campaignId: z.string().uuid().nullable().optional(),
})

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Tên campaign không được trống').max(255),
  description: z.string().max(1000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: 'Ngày kết thúc phải sau ngày bắt đầu',
  path: ['endDate'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .regex(/[a-zA-Z]/, 'Phải có chữ')
      .regex(/[0-9]/, 'Phải có số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateLinkInput = z.infer<typeof createLinkSchema>
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
