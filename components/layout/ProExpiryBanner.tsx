'use client'

import { useProfile } from '@/hooks/useProfile'
import Link from 'next/link'

export function ProExpiryBanner() {
  const { data: profile } = useProfile()

  if (!profile) return null
  if (profile.plan !== 'PRO') return null
  if (!profile.planExpiresAt) return null

  const expiresAt = new Date(profile.planExpiresAt)
  const now = new Date()
  const diffDays = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays > 7) return null

  const isExpired = diffDays <= 0

  const bannerClass = isExpired
    ? 'mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/20 border border-destructive/40 text-destructive flex items-center justify-between'
    : 'mb-4 px-4 py-3 rounded-lg text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-between'

  const message = isExpired
    ? 'Goi Pro cua ban da het han. Gia han de tiep tuc su dung.'
    : `Goi Pro cua ban se het han sau ${diffDays} ngay (${expiresAt.toLocaleDateString('vi-VN')}).`

  return (
    <div className={bannerClass}>
      <span>{message}</span>
      <Link
        href="/dashboard/billing"
        className="ml-4 shrink-0 font-medium underline hover:no-underline text-xs"
      >
        {isExpired ? 'Gia han ngay' : 'Gia han Pro'} →
      </Link>
    </div>
  )
}