'use client'

import { Link2, MousePointerClick, Calendar, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLinks } from '@/hooks/useLinks'
import { useCampaigns } from '@/hooks/useCampaigns'
import { Skeleton } from '@/components/ui/skeleton'
import type { LinkResponse } from '@/hooks/useLinks'
import type { CampaignResponse } from '@/hooks/useCampaigns'

// ── Stat Card ──────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  isLoading,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  isLoading?: boolean
}) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </span>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-2xl font-bold text-foreground">{value}</p>
      )}
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ── Main ───────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const { data: linksData, isLoading: linksLoading } = useLinks()
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns()

  const links: LinkResponse[] = linksData?.content ?? linksData?.items ?? linksData ?? []
  const campaigns: CampaignResponse[] = campaignsData?.content ?? campaignsData?.items ?? campaignsData ?? []

  const totalLinks = links.length
  const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks ?? 0), 0)
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length

  // Top platform
  const platformCount = links.reduce<Record<string, number>>((acc, l) => {
    if (l.platform) acc[l.platform] = (acc[l.platform] ?? 0) + 1
    return acc
  }, {})
  const topPlatform = Object.entries(platformCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const isLoading = linksLoading || campaignsLoading

  return (
    <div className="space-y-6">
      {/* ── Welcome ── */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Chào mừng, {user?.fullName ?? user?.email ?? 'bạn'} 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Đây là tổng quan hoạt động của bạn
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Link2}
          label="Tổng links"
          value={totalLinks}
          sub={`Giới hạn: ${user?.plan === 'FREE' ? '10' : '∞'}`}
          isLoading={isLoading}
        />
        <StatCard
          icon={MousePointerClick}
          label="Tổng clicks"
          value={totalClicks.toLocaleString('vi-VN')}
          sub="Tất cả thời gian"
          isLoading={isLoading}
        />
        <StatCard
          icon={Calendar}
          label="Campaigns đang chạy"
          value={activeCampaigns}
          sub={`${campaigns.length} tổng campaigns`}
          isLoading={isLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Nền tảng chính"
          value={topPlatform}
          sub="Nhiều link nhất"
          isLoading={isLoading}
        />
      </div>

      {/* ── Recent Links ── */}
      {!isLoading && links.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Links gần đây</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            {links.slice(0, 5).map((link, i) => (
              <div
                key={link.id}
                className={`flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors ${i !== 0 ? 'border-t border-border' : ''}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {link.title ?? 'Không có tiêu đề'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{link.shortUrl ?? link.shortCode}</p>
                </div>
                <span className="text-sm text-muted-foreground shrink-0 ml-4">
                  {link.totalClicks ?? 0} clicks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}