import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  createLinkSchema,
  createCampaignSchema,
  changePasswordSchema,
} from '@/lib/validators'

// =========================================================
// registerSchema
// =========================================================

describe('registerSchema', () => {
  it('✅ dữ liệu hợp lệ → parse thành công', () => {
    const result = registerSchema.safeParse({
      email: 'test@gmail.com',
      fullName: 'Nguyen Van A',
      password: 'Password123',
    })
    expect(result.success).toBe(true)
  })

  it('❌ email sai định dạng → lỗi email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      fullName: 'Nguyen Van A',
      password: 'Password123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('email')
  })

  it('❌ fullName < 2 ký tự → lỗi fullName', () => {
    const result = registerSchema.safeParse({
      email: 'test@gmail.com',
      fullName: 'A',
      password: 'Password123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('fullName')
  })

  it('❌ password < 8 ký tự → lỗi password', () => {
    const result = registerSchema.safeParse({
      email: 'test@gmail.com',
      fullName: 'Nguyen Van A',
      password: 'Ab1',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('password')
  })

  it('❌ password không có chữ cái → lỗi password', () => {
    const result = registerSchema.safeParse({
      email: 'test@gmail.com',
      fullName: 'Nguyen Van A',
      password: '12345678',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('password')
  })

  it('❌ password không có số → lỗi password', () => {
    const result = registerSchema.safeParse({
      email: 'test@gmail.com',
      fullName: 'Nguyen Van A',
      password: 'PasswordOnly',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('password')
  })

  it('❌ email rỗng → lỗi', () => {
    const result = registerSchema.safeParse({
      email: '',
      fullName: 'Nguyen Van A',
      password: 'Password123',
    })
    expect(result.success).toBe(false)
  })
})

// =========================================================
// loginSchema
// =========================================================

describe('loginSchema', () => {
  it('✅ dữ liệu hợp lệ → parse thành công', () => {
    const result = loginSchema.safeParse({
      email: 'user@gmail.com',
      password: 'anypassword',
    })
    expect(result.success).toBe(true)
  })

  it('❌ email sai định dạng → lỗi', () => {
    const result = loginSchema.safeParse({
      email: 'notanemail',
      password: 'anypassword',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('email')
  })

  it('❌ password rỗng → lỗi', () => {
    const result = loginSchema.safeParse({
      email: 'user@gmail.com',
      password: '',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('password')
  })

  it('✅ password ngắn vẫn hợp lệ (loginSchema không check độ dài)', () => {
    const result = loginSchema.safeParse({
      email: 'user@gmail.com',
      password: '1',
    })
    expect(result.success).toBe(true)
  })
})

// =========================================================
// createLinkSchema
// =========================================================

describe('createLinkSchema', () => {
  it('✅ URL hợp lệ → parse thành công', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'https://shopee.vn/product/123',
    })
    expect(result.success).toBe(true)
  })

  it('✅ URL với title và tags → parse thành công', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'https://tiki.vn/product/456',
      title: 'Tai nghe Sony',
      tags: ['sale', 'tech'],
      campaignId: null,
    })
    expect(result.success).toBe(true)
  })

  it('❌ URL không hợp lệ → lỗi originalUrl', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('originalUrl')
  })

  it('❌ URL thiếu scheme → lỗi', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'shopee.vn/product/123',
    })
    expect(result.success).toBe(false)
  })

  it('❌ tags > 5 phần tử → lỗi tags', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'https://shopee.vn/product/123',
      tags: ['a', 'b', 'c', 'd', 'e', 'f'],
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('tags')
  })

  it('❌ tag rỗng trong mảng → lỗi', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'https://shopee.vn/product/123',
      tags: ['valid', ''],
    })
    expect(result.success).toBe(false)
  })

  it('✅ tags đúng 5 phần tử → hợp lệ', () => {
    const result = createLinkSchema.safeParse({
      originalUrl: 'https://shopee.vn/product/123',
      tags: ['a', 'b', 'c', 'd', 'e'],
    })
    expect(result.success).toBe(true)
  })
})

// =========================================================
// createCampaignSchema
// =========================================================

describe('createCampaignSchema', () => {
  it('✅ name hợp lệ → parse thành công', () => {
    const result = createCampaignSchema.safeParse({
      name: 'Campaign Thang 4',
    })
    expect(result.success).toBe(true)
  })

  it('❌ name rỗng → lỗi', () => {
    const result = createCampaignSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('name')
  })

  it('✅ startDate < endDate → hợp lệ', () => {
    const result = createCampaignSchema.safeParse({
      name: 'Campaign A',
      startDate: '2026-04-01',
      endDate: '2026-04-30',
    })
    expect(result.success).toBe(true)
  })

  it('❌ endDate < startDate → lỗi refine', () => {
    const result = createCampaignSchema.safeParse({
      name: 'Campaign A',
      startDate: '2026-04-30',
      endDate: '2026-04-01',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('endDate')
  })

  it('✅ startDate === endDate → hợp lệ (cùng ngày được)', () => {
    const result = createCampaignSchema.safeParse({
      name: 'Campaign A',
      startDate: '2026-04-15',
      endDate: '2026-04-15',
    })
    expect(result.success).toBe(true)
  })

  it('✅ không có date → hợp lệ (date optional)', () => {
    const result = createCampaignSchema.safeParse({
      name: 'Campaign khong co date',
    })
    expect(result.success).toBe(true)
  })
})

// =========================================================
// changePasswordSchema
// =========================================================

describe('changePasswordSchema', () => {
  it('✅ dữ liệu hợp lệ → parse thành công', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass456',
      confirmPassword: 'NewPass456',
    })
    expect(result.success).toBe(true)
  })

  it('❌ newPassword !== confirmPassword → lỗi confirmPassword', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass456',
      confirmPassword: 'DifferentPass456',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('confirmPassword')
  })

  it('❌ newPassword === currentPassword → lỗi newPassword', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'SamePass123',
      newPassword: 'SamePass123',
      confirmPassword: 'SamePass123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('newPassword')
  })

  it('❌ newPassword < 8 ký tự → lỗi newPassword', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'Ab1',
      confirmPassword: 'Ab1',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('newPassword')
  })

  it('❌ newPassword không có số → lỗi', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPassOnly',
      confirmPassword: 'NewPassOnly',
    })
    expect(result.success).toBe(false)
  })

  it('❌ currentPassword rỗng → lỗi', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'NewPass123',
      confirmPassword: 'NewPass123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('currentPassword')
  })
})
