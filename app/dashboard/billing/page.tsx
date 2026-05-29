'use client'

import { useProfile } from '@/hooks/useProfile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, Crown, Zap, Copy } from 'lucide-react'
import { toast } from 'sonner'

const FREE_FEATURES = [
  '30 links',
  '30 Deal Posts/tháng',
  '30 lần convert Telegram/tháng',
  '1.000 clicks/tháng',
  'Thống kê 7 ngày',
  'Short link cơ bản',
]

const PRO_FEATURES = [
  'Không giới hạn links',
  'Không giới hạn Deal Posts',
  'Không giới hạn convert Telegram',
  'Không giới hạn clicks',
  'Thống kê 90 ngày',
  'Hỗ trợ ưu tiên',
]

const BANK_INFO = {
  bank: 'Seabank',
  account: '0942567631',
  owner: 'NGUYEN THI HUYEN',
  amount: '50.000đ',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysLeft(expiresAt: string) {
  const now = new Date()
  const exp = new Date(expiresAt)
  const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function PaymentPage() {
  const { data: profile, isLoading } = useProfile()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã copy!')
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const isPro = profile?.plan === 'PRO'
  const expiresAt = profile?.planExpiresAt
  const days = expiresAt ? daysLeft(expiresAt) : 0

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thanh toán</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quản lý gói sử dụng của bạn
        </p>
      </div>

      {/* Trang thai plan hien tai */}
      <Card className={isPro ? 'border-purple-500/50 bg-purple-500/5' : 'border-border'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPro ? (
              <>
                <Crown size={18} className="text-purple-400" />
                <span className="text-purple-400">Gói Pro</span>
              </>
            ) : (
              <>
                <Zap size={18} className="text-muted-foreground" />
                <span>Gói Free</span>
              </>
            )}
            <Badge variant={isPro ? 'default' : 'secondary'} className={isPro ? 'bg-purple-500' : ''}>
              {isPro ? 'Pro' : 'Free'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isPro && expiresAt ? (
              <span className={days <= 7 ? 'text-yellow-500' : 'text-muted-foreground'}>
                Hết hạn: {formatDate(expiresAt)}
                {days <= 7 && ` — Còn ${days} ngày`}
              </span>
            ) : (
              'Nang cap để mở khóa toàn bộ tính năng'
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* So sanh goi */}
      <div className="grid grid-cols-2 gap-4">
        {/* Free */}
        <Card className={!isPro ? 'border-border ring-2 ring-primary' : 'border-border opacity-60'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap size={16} />
              Free
            </CardTitle>
            <div className="text-2xl font-bold">0đ <span className="text-sm font-normal text-muted-foreground">/tháng</span></div>
          </CardHeader>
          <CardContent className="space-y-2">
            {FREE_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={14} className="text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{f}</span>
              </div>
            ))}
            {!isPro && (
              <div className="pt-2">
                <Badge variant="outline" className="w-full justify-center">Gói hiện tại</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className={isPro ? 'border-purple-500/50 ring-2 ring-purple-500' : 'border-purple-500/30'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-purple-400">
              <Crown size={16} />
              Pro
            </CardTitle>
            <div className="text-2xl font-bold">50.000đ <span className="text-sm font-normal text-muted-foreground">/tháng</span></div>
          </CardHeader>
          <CardContent className="space-y-2">
            {PRO_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={14} className="text-purple-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
            {isPro && (
              <div className="pt-2">
                <Badge className="w-full justify-center bg-purple-500">Gói hiện tại</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Thong tin chuyen khoan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isPro ? 'Gia hạn Pro' : 'Nâng cấp lên Pro'}
          </CardTitle>
          <CardDescription>
            Chuyển khoản và gửi bill vào bot Telegram để được xác nhận trong 5 phút
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
            {[
              { label: 'Ngân hàng', value: BANK_INFO.bank },
              { label: 'Số tài khoản', value: BANK_INFO.account },
              { label: 'Chủ tài khoản', value: BANK_INFO.owner },
              { label: 'Số tiền', value: BANK_INFO.amount },
              { label: 'Nội dung', value: `AFFKIT ${profile?.email ?? ''}` },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.value}</span>
                  <button onClick={() => handleCopy(item.value)} className="text-muted-foreground hover:text-foreground">
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border p-4 space-y-2">
            <p className="text-sm font-medium">Hướng dẫn:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Chuyển khoản đúng thông tin trên</li>
              <li>Chụp ảnh bill</li>
              <li>Gửi ảnh vào <span className="font-mono font-medium text-foreground">@affkit_vn_bot</span> kèm email của bạn</li>
              <li>Chờ xác nhận trong 5 phút</li>
            </ol>
          </div>

          <Button
            className="w-full gap-2"
            onClick={() => window.open('https://t.me/affkit_vn_bot', '_blank')}
          >
            Mở Telegram Bot
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
