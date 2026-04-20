import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email khong dung dinh dang').max(255),
  fullName: z.string().min(2, 'Ho ten toi thieu 2 ky tu').max(255),
  password: z
    .string()
    .min(8, 'Mat khau toi thieu 8 ky tu')
    .regex(/[a-zA-Z]/, 'Mat khau phai co chu')
    .regex(/[0-9]/, 'Mat khau phai co so'),
})

export const loginSchema = z.object({
  email: z.string().email('Email khong dung dinh dang'),
  password: z.string().min(1, 'Vui long nhap mat khau'),
})

export const createLinkSchema = z.object({
  originalUrl: z.string().url('URL khong hop le').max(2048, 'URL qua dai'),
  title: z.string().max(255).optional(),
  tags: z.array(z.string().max(50).min(1)).max(5, 'Toi da 5 tags').optional(),
  campaignId: z.string().uuid().nullable().optional(),
})

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Ten campaign khong duoc trong').max(255),
  description: z.string().max(1000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: 'Ngay ket thuc phai sau ngay bat dau',
  path: ['endDate'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email khong dung dinh dang'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui long nhap mat khau hien tai'),
    newPassword: z
      .string()
      .min(8, 'Mat khau toi thieu 8 ky tu')
      .regex(/[a-zA-Z]/, 'Phai co chu')
      .regex(/[0-9]/, 'Phai co so'),
    confirmPassword: z.string().min(1, 'Vui long xac nhan mat khau'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Mat khau khong khop',
    path: ['confirmPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'Mat khau moi phai khac mat khau hien tai',
    path: ['newPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateLinkInput = z.infer<typeof createLinkSchema>
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>