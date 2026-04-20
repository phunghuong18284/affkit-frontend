'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface LinkAnalytics {
  summary: {
    totalClicks: number
    shortCode: string
    originalUrl: string
    title: string
  }
  clicksByDay: { date: string; clicks: number }[]
  deviceBreakdown: { device: string; clicks: number; percentage: number }[]
  sourceBreakdown: { source: string; clicks: number; percentage: number }[]
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

const PERIODS = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
]

export default function LinkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [period, setPeriod] = useState('30d')

  const { data, isLoading, isError } = useQuery<LinkAnalytics>({
    queryKey: ['link-analytics', id, period],
    queryFn: async () => {
      const res = await api.get(`/analytics/links/${id}?period=${period}`)
      return res as unknown as LinkAnalytics
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Link not found or you do not have access.</p>
        <button
          onClick={() => router.push('/dashboard/links')}
          className="mt-4 text-primary hover:underline"
        >
          Back to links
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/links')}
          className="text-muted-foreground hover:text-foreground transition"
        >
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">
            {data.summary.title || 'Untitled link'}
          </h1>
          <p className="text-sm text-muted-foreground truncate max-w-lg">
            {data.summary.originalUrl}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Short link:</span>
        <a
          href={`http://localhost:8080/r/${data.summary.shortCode}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary font-mono hover:underline text-sm"
        >
          localhost:8080/r/{data.summary.shortCode}
        </a>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                period === p.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl px-6 py-3 text-center">
          <p className="text-3xl font-bold">{data.summary.totalClicks}</p>
          <p className="text-sm text-muted-foreground">Total clicks</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Clicks over time</h2>
        {data.clicksByDay.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No click data for this period.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.clicksByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Device breakdown</h2>
          {data.deviceBreakdown.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No data.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.deviceBreakdown}
                  dataKey="clicks"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ device, percentage }) =>
                    `${device} ${percentage.toFixed(0)}%`
                  }
                >
                  {data.deviceBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Source breakdown</h2>
          {data.sourceBreakdown.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No data.
            </p>
          ) : (
            <div className="space-y-3">
              {data.sourceBreakdown.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{s.source}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-10 text-right">
                      {s.clicks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
