'use client'

import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { MousePointerClick, Link2, TrendingUp, Zap } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalyticsOverview, type AnalyticsPeriod } from '@/hooks/useAnalytics'

// ── Constants ──────────────────────────────────────
const PERIODS: { label: string; value: AnalyticsPeriod }[] = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày',  value: '7d' },
  { label: '30 ngày', value: '30d' },
  { label: '90 ngày', value: '90d' },
]

const SOURCE_COLORS: Record<string, string> = {
  ZALO:     '#0068ff',
  TELEGRAM: '#2aabee',
  FACEBOOK: '#1877f2',
  DIRECT:   '#10b981',
  OTHER:    '#6b7280',
}

const DEVICE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#6b7280']

// ── Stat Card ──────────────────────────────────────
function StatCard({ icon: Icon, label, value, isLoading }: {
  icon: React.ElementType
  label: string
  value: string | number
  isLoading?: boolean
}) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      {isLoading
        ? <Skeleton className="h-8 w-24" />
        : <p className="text-2xl font-bold text-foreground">{value}</p>
      }
    </div>
  )
}

// ── Main ───────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d')
  const { data, isLoading, isError } = useAnalyticsOverview(period)

  return (
    <div className="space-y-6">
      {/* ── Header + Period selector ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">Thống kê click và hiệu suất link</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${
                period === p.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="text-center py-12 text-sm text-destructive border border-dashed border-border rounded-lg">
          Không thể tải dữ liệu analytics. Vui lòng thử lại.
        </div>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MousePointerClick} label="Tổng clicks"     value={data?.summary.totalClicks.toLocaleString('vi-VN') ?? 0} isLoading={isLoading} />
        <StatCard icon={Link2}            label="Tổng links"       value={data?.summary.totalLinks ?? 0}    isLoading={isLoading} />
        <StatCard icon={Zap}              label="Nguồn chính"      value={data?.summary.topSource ?? '—'}   isLoading={isLoading} />
        <StatCard icon={TrendingUp}       label="Tăng trưởng"      value={`${data?.summary.growthPercent ?? 0}%`} isLoading={isLoading} />
      </div>

      {/* ── Clicks by Day Chart ── */}
      <div className="p-4 border border-border rounded-lg bg-card space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Clicks theo ngày</h3>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (data?.clicksByDay?.length ?? 0) === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data?.clicksByDay}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: 12 }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#6366f1" fill="url(#clickGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Source + Device ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Source Breakdown */}
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Nguồn traffic</h3>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (data?.sourceBreakdown?.length ?? 0) === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Chưa có dữ liệu</div>
          ) : (
            <div className="space-y-2">
              {data?.sourceBreakdown.map((s) => (
                <div key={s.source} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{s.source}</span>
                    <span className="text-muted-foreground">{s.clicks} clicks ({s.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${s.percentage}%`,
                        backgroundColor: SOURCE_COLORS[s.source] ?? '#6b7280'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Thiết bị</h3>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (data?.deviceBreakdown?.length ?? 0) === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Chưa có dữ liệu</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={data?.deviceBreakdown} dataKey="clicks" nameKey="device" cx="50%" cy="50%" outerRadius={60} strokeWidth={0}>
                    {data?.deviceBreakdown.map((_, i) => (
                      <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {data?.deviceBreakdown.map((d, i) => (
                  <div key={d.device} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      <span className="text-foreground">{d.device}</span>
                    </div>
                    <span className="text-muted-foreground">{d.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}