'use client'

import { useQuery } from '@tanstack/react-query'
import { DollarSign, Clock, CheckCircle2, XCircle, Settings, ExternalLink, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { useProfile } from '@/hooks/useProfile'

interface Transaction {
  orderId: string
  transactionTime: number
  commission: number
  transactionValue: number
  status: number
  merchantName: string
  campaignName: string
}

interface CommissionData {
  totalCount: number
  data: Transaction[]
}

function useCommissions() {
  return useQuery<CommissionData>({
    queryKey: ['commissions'],
    queryFn: async () => {
      const res = await api.get('/commissions?limit=50&page=0')
      return res.data.data
    },
    retry: false,
  })
}

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function StatusBadge({ status }: { status: number }) {
  if (status === 1) return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
      <CheckCircle2 size={11} /> Đã duyệt
    </span>
  )
  if (status === 2) return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">
      <XCircle size={11} /> Từ chối
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">
      <Clock size={11} /> Chờ duyệt
    </span>
  )
}

export default function CommissionsPage() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const { data, isLoading, isError } = useCommissions()

  const hasApiKey = profile?.hasAccessTradeKey ?? false

  if (!isLoading && !hasApiKey) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto">
          <DollarSign size={28} className="text-zinc-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Đã kết nối AccessTrade</h2>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto">
          Nhập API key AccessTrade vào phần Cài đặt để xem hoa hồng của bạn ngay trong AffKit.
        </p>
        <Button onClick={() => router.push('/dashboard/settings')} className="gap-2">
          <Settings size={16} />
          Đi đến Cài đặt
        </Button>
        <div className="pt-2">
          <a
            href="https://pub2.accesstrade.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 justify-center transition-colors"
          >
            Lấy API key tại pub2.accesstrade.vn
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
          <XCircle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Không thể tải dữ liệu</h2>
        <p className="text-zinc-400 text-sm">API key có thể đã hết hạn hoặc không hợp lệ. Kiểm tra lại trong Cài đặt.</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/settings')} className="gap-2">
          <Settings size={16} />
          Kiểm tra Cài đặt
        </Button>
      </div>
    )
  }

  const transactions: Transaction[] = data?.data ?? []
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0)
  const approvedCommission = transactions.filter(t => t.status === 1).reduce((sum, t) => sum + t.commission, 0)
  const pendingCommission = transactions.filter(t => t.status === 0).reduce((sum, t) => sum + t.commission, 0)
  const totalValue = transactions.reduce((sum, t) => sum + t.transactionValue, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Hoa hồng</h1>
        <p className="text-zinc-400 text-sm">Dữ liệu từ AccessTrade — cập nhật theo thời gian thực</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Tổng hoa hồng</span>
              <DollarSign size={16} className="text-violet-400" />
            </div>
            <p className="text-2xl font-bold text-white">{formatVND(totalCommission)}</p>
            <p className="text-xs text-zinc-500">{transactions.length} giao dịch</p>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Đã duyệt</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{formatVND(approvedCommission)}</p>
            <p className="text-xs text-zinc-500">{transactions.filter(t => t.status === 1).length} giao dịch</p>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Chờ duyệt</span>
              <Clock size={16} className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">{formatVND(pendingCommission)}</p>
            <p className="text-xs text-zinc-500">{transactions.filter(t => t.status === 0).length} giao dịch</p>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Tổng đơn hàng</span>
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{formatVND(totalValue)}</p>
            <p className="text-xs text-zinc-500">Giá trị đơn hàng</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Giao dịch gần đây</h2>
          <span className="text-xs text-zinc-500">{transactions.length} kết quả</span>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-zinc-500 text-sm">Chưa có giao dịch nào.</p>
            <p className="text-zinc-600 text-xs mt-1">Chia sẻ link affiliate để bắt đầu kiếm hoa hồng!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="text-left px-5 py-3 font-medium text-zinc-400">Merchant</th>
                  <th className="text-left px-5 py-3 font-medium text-zinc-400">Campaign</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-400">Giá trị đơn</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-400">Hoa hồng</th>
                  <th className="text-center px-5 py-3 font-medium text-zinc-400">Trạng thái</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-400">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={t.orderId ?? i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{t.merchantName ?? '—'}</td>
                    <td className="px-5 py-3 text-zinc-400 max-w-[200px] truncate">{t.campaignName ?? '—'}</td>
                    <td className="px-5 py-3 text-right text-zinc-300">{formatVND(t.transactionValue)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-400">{formatVND(t.commission)}</td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 text-right text-zinc-500">{formatDate(t.transactionTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
