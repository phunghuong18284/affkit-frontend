'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Link2, BarChart2, Zap, MessageCircle,
  Check, ArrowRight, ExternalLink, Sparkles,
  DollarSign, Settings, X, TrendingUp, Clock, Users
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function LandingPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && user) router.push('/dashboard')
  }, [mounted, user, router])

  if (!mounted || user) return null

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
            <button onClick={() => router.push('/login')}
              className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
              Đăng nhập
            </button>
            <button onClick={() => router.push('/register')}
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">
              Dùng miễn phí
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={12} />
            Công cụ #1 cho affiliate Việt Nam
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Từ link rời rạc<br />
            <span className="text-violet-400">đến thu nhập ổn định</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-4 max-w-xl mx-auto leading-relaxed">
            Tự động convert link Shopee, Lazada, Tiki, TikTok Shop sang affiliate link của bạn.
            Theo dõi click, xem hoa hồng, tạo bài đăng deal — tất cả trong một nơi.
          </p>
          {/* Stats bar */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Users size={14} className="text-violet-400" />
              <span>100+ affiliate đang dùng</span>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-1.5 text-zinc-400">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>7 sàn được hỗ trợ</span>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock size={14} className="text-amber-400" />
              <span>Setup trong 2 phút</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => router.push('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              Bắt đầu miễn phí
              <ArrowRight size={16} />
            </button>
            <button onClick={() => router.push('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-zinc-300 px-6 py-3 rounded-xl font-medium text-sm transition-colors">
              Đã có tài khoản
            </button>
          </div>
          <p className="text-xs text-zinc-600 mt-4">Miễn phí 30 links · Không cần thẻ tín dụng</p>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Bạn có đang gặp những vấn đề này?</h2>
            <p className="text-zinc-500 text-sm">90% affiliate Việt Nam đều đang chịu đựng điều này mỗi ngày</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: X,
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                title: 'Link rời rạc khắp nơi',
                desc: 'Link Shopee một nơi, Lazada một nơi, TikTok một nơi. Không biết link nào đang chạy tốt.',
              },
              {
                icon: X,
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                title: 'Không biết link nào ra đơn',
                desc: 'Chia sẻ đủ khắp nơi nhưng không biết kênh nào hiệu quả. Tiền hỏa hồng đến nhưng không hiểu tại sao.',
              },
              {
                icon: X,
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                title: 'Mất hàng giờ tạo bài',
                desc: 'Copy tên sản phẩm, sửa giá, viết caption, gắn link… lặp lại mỗi ngày. Mệt mỏi mà không scale được.',
              },
            ].map((p) => (
              <div key={p.title} className="p-5 rounded-2xl border border-red-500/10 bg-red-500/5">
                <div className={`w-8 h-8 rounded-xl ${p.bg} flex items-center justify-center mb-3`}>
                  <p.icon size={16} className={p.color} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{p.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full">
              <Check size={14} />
              AffKit giải quyết tất cả 3 vấn đề này
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Bắt đầu trong 3 bước</h2>
            <p className="text-zinc-500 text-sm">Setup xong trong 2 phút, dùng mãi mãi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* connector line desktop */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-gradient-to-r from-violet-500/20 via-violet-500/40 to-violet-500/20" />
            {[
              {
                step: '01',
                icon: Settings,
                color: 'text-violet-400',
                bg: 'bg-violet-500/15',
                title: 'Kết nối AccessTrade',
                desc: 'Đăng ký AffKit miễn phí → dán API key AccessTrade vào phần Cài đặt. Hoa hồng sẽ về đúng tài khoản bạn.',
              },
              {
                step: '02',
                icon: Zap,
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/15',
                title: 'Dán link, nhận affiliate link',
                desc: 'Dán link sản phẩm bất kỳ vào AffKit hoặc gửi vào Telegram Bot → nhận ngay affiliate link của bạn.',
              },
              {
                step: '03',
                icon: TrendingUp,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/15',
                title: 'Chia sẻ và theo dõi',
                desc: 'Chia sẻ link, xem click theo ngày, biết kênh nào hiệu quả nhất, xem hoa hồng — tất cả trong AffKit.',
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center relative">
                <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center mb-4 relative z-10`}>
                  <s.icon size={24} className={s.color} />
                </div>
                <div className="text-xs font-bold text-zinc-600 mb-2">BƯỚC {s.step}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{s.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4 border-t border-white/5">
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
                highlight: false,
              },
              {
                icon: Zap,
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
                title: 'Auto-convert affiliate link',
                desc: 'Dán link Shopee / Lazada / Tiki / TikTok / Nguyễn Kim / JUNO / Vascara → tự động chuyển sang link affiliate qua AccessTrade.',
                highlight: true,
              },
              {
                icon: BarChart2,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                title: 'Analytics chi tiết',
                desc: 'Xem click theo ngày, nguồn traffic (Zalo, Telegram, Facebook), thiết bị và giờ vàng hiệu quả nhất.',
                highlight: false,
              },
              {
                icon: MessageCircle,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                title: 'Telegram Bot',
                desc: 'Gửi link vào @affkit_vn_bot → nhận ngay affiliate link. Hỗ trợ bulk convert nhiều link cùng lúc.',
                highlight: false,
              },
              {
                icon: Sparkles,
                color: 'text-pink-400',
                bg: 'bg-pink-500/10',
                title: 'Tạo bài đăng Deal',
                desc: 'Nhập link sản phẩm → tự động tạo bài đăng deal đẹp cho Zalo, Telegram, Facebook. Tiết kiệm hàng giờ mỗi ngày.',
                highlight: false,
              },
              {
                icon: DollarSign,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                title: 'Hoa hồng AccessTrade',
                desc: 'Kết nối API key để xem hoa hồng, đơn hàng và doanh thu trực tiếp trong AffKit. Không cần mở nhiều tab.',
                highlight: false,
              },
            ].map((f) => (
              <div key={f.title} className={`p-5 rounded-2xl border transition-colors ${f.highlight ? 'border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/8' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}>
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

      {/* ── Supported Platforms ── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-500 text-sm mb-8">Hỗ trợ đầy đủ các sàn affiliate lớn tại Việt Nam</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'Shopee', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
              { name: 'Lazada', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { name: 'Tiki', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
              { name: 'TikTok Shop', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
              { name: 'Nguyễn Kim', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
              { name: 'JUNO', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
              { name: 'Vascara', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            ].map((p) => (
              <div key={p.name} className={`px-4 py-2 rounded-xl border ${p.border} ${p.bg} ${p.color} text-sm font-medium`}>
                {p.name}
              </div>
            ))}
          </div>
          <p className="text-zinc-600 text-xs mt-4">Thêm sàn mới được cập nhật liên tục</p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Giá đơn giản, minh bạch</h2>
            <p className="text-zinc-500 text-sm">Bắt đầu miễn phí, nâng cấp khi cần</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                name: 'Free',
                price: '0đ',
                period: '',
                icon: Sparkles,
                color: 'text-zinc-400',
                bg: 'bg-zinc-800',
                border: 'border-zinc-800',
                features: [
                  '30 links',
                  '30 bài đăng Deal/tháng',
                  '30 lần convert Telegram/tháng',
                  '1.000 clicks/tháng',
                  'Analytics 7 ngày',
                  'Telegram Bot cơ bản',
                ],
                cta: 'Bắt đầu miễn phí',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '50.000đ',
                period: '/tháng',
                icon: Zap,
                color: 'text-violet-400',
                bg: 'bg-violet-500/15',
                border: 'border-violet-500',
                badge: 'Phổ biến',
                features: [
                  'Không giới hạn links',
                  'Không giới hạn bài Deal',
                  'Không giới hạn convert',
                  'Không giới hạn clicks',
                  'Analytics 90 ngày',
                  'Hỗ trợ ưu tiên qua Telegram',
                ],
                cta: 'Nâng cấp Pro',
                highlight: true,
              },
            ].map((p) => (
              <div key={p.name} className={`relative flex flex-col rounded-2xl border ${p.border} bg-zinc-900 p-5 ${p.highlight ? 'ring-1 ring-violet-500/30' : ''}`}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{p.badge}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${p.bg}`}>
                    <p.icon size={14} className={p.color} />
                  </div>
                  <span className="font-semibold text-white text-sm">{p.name}</span>
                </div>
                <div className="mb-1">
                  <span className="text-2xl font-bold text-white">{p.price}</span>
                  {p.period && <span className="text-zinc-500 text-xs">{p.period}</span>}
                </div>
                {p.highlight && (
                  <p className="text-xs text-zinc-500 mb-4">Chưa đến 2.000đ/ngày</p>
                )}
                {!p.highlight && <div className="mb-4" />}
                <button
                  onClick={() => router.push('/register')}
                  className={`w-full py-2 rounded-xl text-xs font-semibold mb-4 transition-colors ${p.highlight ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'}`}>
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
          <p className="text-center text-xs text-zinc-600 mt-6">
            Thanh toán qua chuyển khoản ngân hàng · Dữ liệu giữ nguyên khi hết hạn
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'AffKit có lấy hoa hồng của tôi không?',
                a: 'Hoàn toàn không. Bạn dùng API key AccessTrade của chính mình, hoa hồng về thẳng tài khoản AT của bạn. AffKit chỉ là công cụ quản lý.',
              },
              {
                q: 'Tôi cần có tài khoản AccessTrade không?',
                a: 'Có. Bạn cần đăng ký miễn phí tại pub2.accesstrade.vn và tham gia các campaign (Shopee, Lazada...). Sau đó dán API key vào AffKit.',
              },
              {
                q: 'Tôi có thể dùng bot Telegram mà không vào web không?',
                a: 'Hoàn toàn được. Gửi link vào @affkit_vn_bot là nhận ngay affiliate link. Không cần mở trình duyệt.',
              },
              {
                q: 'Sau khi hết hạn Pro, dữ liệu có bị xóa không?',
                a: 'Không. Tài khoản tự động về Free nhưng toàn bộ links, analytics và lịch sử vẫn được giữ nguyên.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-sm font-semibold text-white mb-2">{item.q}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-10">
            <h2 className="text-2xl font-bold text-white mb-3">Sẵn sàng kiếm nhiều hơn từ affiliate?</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Tham gia cùng 100+ affiliate Việt Nam đang dùng AffKit.<br />
              Miễn phí hoàn toàn. Không cần thẻ tín dụng. Nâng cấp bất cứ lúc nào.
            </p>
            <button onClick={() => router.push('/register')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]">
              Đăng ký miễn phí ngay
              <ArrowRight size={16} />
            </button>
            <p className="text-xs text-zinc-600 mt-4">Setup trong 2 phút · Không cần thẻ</p>
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
            <span className="text-zinc-700">Công cụ quản lý link affiliate cho người Việt</span>
            <a href="https://t.me/phunghuong1820" target="_blank" rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors flex items-center gap-1">
              Hỗ trợ <ExternalLink size={10} />
            </a>
            <span>phunghuong18284@gmail.com</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
