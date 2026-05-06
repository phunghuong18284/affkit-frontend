// @ts-nocheck
// =============================================================================
// components/analytics/StatCard.tsx
// =============================================================================

'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/queryClient'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number        // % tăng/giảm so với kỳ trước
  isLoading?: boolean
}

export function StatCard({ title, value, icon: Icon, trend, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  const isPositive = (trend ?? 0) >= 0

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon size={16} className="text-primary" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 mt-1 text-xs font-medium',
            isPositive ? 'text-green-500' : 'text-red-500'
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}% so với kỳ trước
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// components/analytics/PeriodSelector.tsx
// =============================================================================

'use client'

import { PERIODS } from '@/lib/constants'
import { cn } from '@/lib/queryClient'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            value === p.value
              ? 'bg-background text-foreground shadow-sm font-medium'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// components/analytics/ClickBarChart.tsx
// =============================================================================

'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ClickByDay } from '@/types/analytics-campaign'

interface Props {
  data: ClickByDay[]
  isLoading: boolean
  title: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {payload[0].value} click
        </p>
      </div>
    )
  }
  return null
}

export function ClickBarChart({ data, isLoading, title }: Props) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : data.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
            Chưa có dữ liệu. Share link để bắt đầu!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  const d = new Date(val)
                  return `${d.getDate()}/${d.getMonth() + 1}`
                }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
              <Bar
                dataKey="clicks"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// components/analytics/TopLinksList.tsx
// =============================================================================

'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TopLink } from '@/types/analytics-campaign'
import { formatNumber } from '@/lib/queryClient'
import { PlatformBadge } from '@/components/links/PlatformBadge'

interface Props {
  links: TopLink[]
  isLoading: boolean
}

export function TopLinksList({ links, isLoading }: Props) {
  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Top Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))
        ) : links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Chưa có dữ liệu
          </p>
        ) : (
          links.map((link, i) => (
            <div key={link.linkId} className="flex items-center gap-3 group">
              <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {link.title ?? link.shortCode}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <PlatformBadge platform={link.platform as any} size="xs" />
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(link.totalClicks)} clicks
                  </span>
                </div>
              </div>
              <Link
                href={`/links/${link.linkId}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              >
                <ExternalLink size={14} />
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
