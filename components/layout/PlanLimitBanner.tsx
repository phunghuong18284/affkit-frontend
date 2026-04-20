'use client'

import { useProfile } from '@/hooks/useProfile'

export function PlanLimitBanner() {
  const { data: profile } = useProfile()

  if (!profile) return null
  if (profile.plan !== 'FREE') return null

  const pct = Math.round((profile.linksUsed / profile.linksLimit) * 100)
  if (pct < 80) return null

  const isMaxed = profile.linksUsed >= profile.linksLimit

  const bannerClass = isMaxed
    ? 'mb-4 px-4 py-2 rounded-lg text-sm flex items-center justify-between bg-destructive/20 border border-destructive/40 text-destructive'
    : 'mb-4 px-4 py-2 rounded-lg text-sm flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'

  const message = isMaxed
    ? `Used ${profile.linksLimit}/${profile.linksLimit} links - FREE plan limit reached.`
    : `Used ${profile.linksUsed}/${profile.linksLimit} links (${pct}%).`

  return (
    <div className={bannerClass}>
      <span>{message} Upgrade for unlimited links.</span>
      <a href="/dashboard/billing" className="ml-4 shrink-0 font-medium underline hover:no-underline">
        Upgrade Pro
      </a>
    </div>
  )
}