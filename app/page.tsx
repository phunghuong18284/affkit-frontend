'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Link2, BarChart2, Zap, MessageCircle, ChevronRight,
  Check, ArrowRight, ExternalLink, Sparkles, Building2, Crown
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function LandingPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      router.push('/dashboard')
    }
  }, [mounted, user, router])

  if (!mounted) return null
  if (user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Link2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">AffKit</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => router.push('/register')}
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              Dùng miễn phí
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={12} />
            Dành cho affiliate Việt Nam
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Quản lý link affiliate<br />
            <span className="text-violet-400">thông minh hơn</span>
          </h1>

          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Rút gọn link, theo dõi analytics, auto-convert sang affiliate link Shopee / Lazada / Tiki — tất cả trong một nơi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Bắt đầu miễn phí
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-zinc-300 px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              Đã có tài khoản
            </button>
          </div>

          <p className="text-xs text-zinc-600 mt-4">Miễn phí 30 links · Không cần thẻ tín dụng</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Mọi thứ bạn cần để làm affiliate hiệu quả</h2>
            <p className="text-zinc-500 text-sm">Không cần dùng nhiều tool khác nhau nữa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Link2,
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
                title: 'Quản lý link tập trung',
                desc: 'Tạo link rút gọn, gắn campaign, tìm kiếm và lọc theo nền tảng. Không còn link rời rạc mỗi sàn mỗi nơi.',
              },
              {
                icon: Zap,
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
                title: 'Auto-convert affiliate link',
                desc: 'Dán link Shopee / Lazada / Tiki → tự động chuyển sang link affiliate của bạn qua AccessTrade. 1 click.',
              },
              {
                icon: BarChart2,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                title: 'Analytics chi tiết',
                desc: 'Xem click theo ngày, nguồn traffic (Zalo, Telegram, Facebook), thiết bị và giờ vàng hiệu quả nhất.',
              },
              {
                icon: MessageCircle,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                title: 'Telegram Bot',
                desc: 'Gửi link vào @affkit_vn_bot → nhận ngay affiliate link. Tiện nhất cho người dùng điện thoại.',
              },
              {
                icon: Sparkles,
                color: 'text-pink-400',
                bg: 'bg-pink-500/10',
                title: 'Deal Post Generator',
                desc: 'Nhập link sản phẩm → tự động tạo bài đăng deal đẹp cho Zalo, Telegram, Facebook. Tiết kiệm hàng giờ mỗi ngày.',
              },
              {
                icon: ChevronRight,
                color: 'text-zinc-400',
                bg: 'bg-zinc-800',
                title: 'Và còn nhiều hơn...',
                desc: 'Campaign management, link analytics chi tiết, lịch sử bài đăng, và nhiều tính năng đang phát triển.',
              },
            ].map((f) => (
              <div key={f.title} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={18} className={f.color} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Giá đơn giản, minh bạch</h2>
            <p className="text-zinc-500 text-sm">Bắt đầu miễn phí, nâng cấp khi cần</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Free',
                price: '0đ',
                period: '',
                icon: Sparkles,
                color: 'text-zinc-400',
                bg: 'bg-zinc-800',
                border: 'border-zinc-800',
                features: ['30 links', '1.000 clicks/tháng', 'Analytics 7 ngày', 'Short link cơ bản'],
                cta: 'Bắt đầu miễn phí',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '99.000đ',
                period: '/tháng',
                icon: Zap,
                color: 'text-violet-400',
                bg: 'bg-violet-500/15',
                border: 'border-violet-500',
                badge: 'Phổ biến',
                features: ['Không giới hạn links', 'Không giới hạn clicks', 'Analytics 90 ngày', 'Deal Post Generator', 'Telegram Bot', 'Hỗ trợ ưu tiên'],
                cta: 'Nâng cấp Pro',
                highlight: true,
              },
              {
                name: 'Business',
                price: '299.000đ',
                period: '/tháng',
                icon: Building2,
                color: 'text-amber-400',
                bg: 'bg-amber-500/15',
                border: 'border-amber-500/40',
                features: ['Tất cả Pro', 'Affiliate dashboard', 'Deal post không giới hạn', 'Analytics không giới hạn', 'Hỗ trợ 24/7'],
                cta: 'Nâng cấp Business',
                highlight: false,
              },
              {
                name: 'Enterprise',
                price: 'Liên hệ',
                period: '',
                icon: Crown,
                color: 'text-zinc-400',
                bg: 'bg-zinc-800',
                border: 'border-zinc-700',
                features: ['Tất cả Business', 'White-label', 'API access', 'SLA uptime', 'Onboarding 1-1'],
                cta: 'Liên hệ tư vấn',
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border ${p.border} bg-zinc-900 p-5 ${p.highlight ? 'ring-1 ring-violet-500/30' : ''}`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {p.badge}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${p.bg}`}>
                    <p.icon size={14} className={p.color} />
                  </div>
                  <span className="font-semibold text-white text-sm">{p.name}</span>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-white">{p.price}</span>
                  {p.period && <span className="text-zinc-500 text-xs">{p.period}</span>}
                </div>
                <button
                  onClick={() => router.push('/register')}
                  className={`w-full py-2 rounded-xl text-xs font-semibold mb-4 transition-colors ${
                    p.highlight
                      ? 'bg-violet-600 hover:bg-violet-500 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  {p.cta}
                </button>
                <ul className="space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-10">
            <h2 className="text-2xl font-bold text-white mb-3">Bắt đầu ngay hôm nay</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Miễn phí hoàn toàn. Không cần thẻ tín dụng. Nâng cấp bất cứ lúc nào.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
            >
              Đăng ký miễn phí
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <Link2 size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">AffKit</span>
            <span className="text-xs text-zinc-600">© 2026</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <a href="https://t.me/phunghuong1820" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors flex items-center gap-1">
              Telegram <ExternalLink size={10} />
            </a>
            <span>phunghuong18284@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  )
}