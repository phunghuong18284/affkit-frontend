'use client'

import { useProfile } from '@/hooks/useProfile'
import Link from 'next/link'

interface QuotaItemProps {
  label: string
  used: number
  limit: number
}

function QuotaItem({ label, used, limit }: QuotaItemProps) {
  const isMaxed = used >= limit
  const pct = Math.min(Math.round((used / limit) * 100), 100)

  const barColor = isMaxed
    ? 'bg-destructive'
    : pct >= 80
    ? 'bg-yellow-400'
    : 'bg-primary'

  return (
    <div className="flex-1 min-w-[120px]">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className={isMaxed ? 'text-destructive font-semibold' : ''}>
          {used}/{limit === 2147483647 ? '∞' : limit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function PlanLimitBanner() {
  const { data: profile } = useProfile()

  if (!profile) return null
  if (profile.plan !== 'FREE') return null

  // Chỉ hiện khi ít nhất 1 quota >= 80%
  const linksPct = Math.round((profile.linksUsed / profile.linksLimit) * 100)
  const dealPct = Math.round((profile.dealPostUsed / profile.dealPostLimit) * 100)
  const tgPct = Math.round((profile.telegramConvertUsed / profile.telegramConvertLimit) * 100)

  if (linksPct < 80 && dealPct < 80 && tgPct < 80) return null

  const hasMaxed =
    profile.linksUsed >= profile.linksLimit ||
    profile.dealPostUsed >= profile.dealPostLimit ||
    profile.telegramConvertUsed >= profile.telegramConvertLimit

  const bannerClass = hasMaxed
    ? 'mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/20 border border-destructive/40 text-destructive'
    : 'mb-4 px-4 py-3 rounded-lg text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'

  return (
    <div className={bannerClass}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">
          {hasMaxed ? 'Da dat gioi han Free plan!' : 'Sap dat gioi han Free plan'}
        </span>
        <Link
          href="/dashboard/billing"
          className="ml-4 shrink-0 font-medium underline hover:no-underline text-xs"
        >
          Nang cap Pro →
        </Link>
      </div>
      <div className="flex gap-4 flex-wrap">
        <QuotaItem
          label="Links"
          used={profile.linksUsed}
          limit={profile.linksLimit}
        />
        <QuotaItem
          label="Deal Post"
          used={profile.dealPostUsed}
          limit={profile.dealPostLimit}
        />
        <QuotaItem
          label="Telegram Convert"
          used={profile.telegramConvertUsed}
          limit={profile.telegramConvertLimit}
        />
      </div>
    </div>
  )
}