export const PLAN_LIMITS = {
  FREE: {
    links: 10,
    clicksMonthly: 1000,
    analyticsRetentionDays: 7,
  },
  PRO: {
    links: -1,
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