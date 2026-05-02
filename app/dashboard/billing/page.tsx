'use client'

import { useAuthStore } from '@/store/authStore'
import { Check, Zap, Building2, Crown, MessageCircle, ExternalLink, Sparkles } from 'lucide-react'

const TELEGRAM_URL = 'https://t.me/phunghuong1820'

const plans = [
  {
    key: 'FREE',
    name: 'Free',
    price: '0d',
    period: '',
    description: 'Dung thu, khong can the',
    icon: Sparkles,
    borderColor: 'border-zinc-700',
    badge: null,
    features: ['10 links toi da', '1.000 clicks/thang', 'Short link co ban', 'Analytics 7 ngay'],
    missing: ['Affiliate dashboard', 'Deal Post Generator', 'Telegram Bot', 'Uu tien ho tro'],
    cta: 'Dang dung',
    ctaDisabled: true,
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '99.000d',
    period: '/thang',
    description: 'Danh cho affiliate ca nhan',
    icon: Zap,
    borderColor: 'border-violet-500',
    badge: 'Pho bien nhat',
    features: [
      'Khong gioi han links',
      'Khong gioi han clicks',
      'Analytics 90 ngay',
      'Affiliate dashboard (2 san)',
      'Deal Post Generator (50 posts/thang)',
      'Telegram Bot',
      'Ho tro uu tien',
    ],
    missing: [],
    cta: 'Nang cap Pro',
    ctaDisabled: false,
  },
  {
    key: 'BUSINESS',
    name: 'Business',
    price: '299.000d',
    period: '/thang',
    description: 'Danh cho KOL va admin nhom',
    icon: Building2,
    borderColor: 'border-amber-500',
    badge: null,
    features: [
      'Tat ca tinh nang Pro',
      'Affiliate dashboard (tat ca san)',
      'Deal Post Generator (khong gioi han)',
      'Analytics khong gioi han',
      'Quan ly nhom (coming soon)',
      'Ho tro 24/7',
    ],
    missing: [],
    cta: 'Nang cap Business',
    ctaDisabled: false,
  },
  {
    key: 'ENTERPRISE',
    name: 'Enterprise',
    price: 'Lien he',
    period: '',
    description: 'Cho shop va doanh nghiep',
    icon: Crown,
    borderColor: 'border-zinc-600',
    badge: null,
    features: ['Tat ca tinh nang Business', 'White-label', 'API access', 'SLA uptime', 'Onboarding 1-1'],
    missing: [],
    cta: 'Lien he tu van',
    ctaDisabled: false,
  },
]

export default function BillingPage() {
  const user = useAuthStore((s) => s.user)
  const currentPlan = (user as any)?.plan ?? 'FREE'

  function handleUpgrade() {
    window.open(TELEGRAM_URL, '_blank')
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">Nang cap tai khoan</h1>
        <p className="text-zinc-400 text-sm">
          Plan hien tai: <span className="text-white font-medium">{currentPlan}</span>
          {currentPlan === 'FREE' && (
            <span className="ml-2 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
              Mien phi
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = plan.key === currentPlan
          return (
            <div
              key={plan.key}
              className={
                'relative flex flex-col rounded-2xl border bg-zinc-900 p-6 ' +
                (isCurrentPlan ? 'border-violet-500 ring-1 ring-violet-500/30' : plan.borderColor)
              }
            >
              {plan.badge && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                    Plan hien tai
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div
                  className={
                    'p-2 rounded-lg ' +
                    (plan.key === 'PRO' ? 'bg-violet-500/15 text-violet-400' :
                     plan.key === 'BUSINESS' ? 'bg-amber-500/15 text-amber-400' :
                     'bg-zinc-800 text-zinc-400')
                  }
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-white">{plan.name}</span>
              </div>

              <div className="mb-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-zinc-400 text-sm">{plan.period}</span>}
              </div>
              <p className="text-zinc-500 text-xs mb-6">{plan.description}</p>

              <button
                onClick={() => !plan.ctaDisabled && handleUpgrade()}
                disabled={plan.ctaDisabled}
                className={
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 mb-6 ' +
                  (isCurrentPlan
                    ? 'bg-zinc-800 text-zinc-500 cursor-default'
                    : plan.key === 'PRO'
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : plan.key === 'BUSINESS'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700')
                }
              >
                {plan.cta}
              </button>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-600 line-through">
                    <span className="w-3.5 mt-0.5 shrink-0">-</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold mb-1">Can ho tro hoac muon nang cap ngay?</p>
          <p className="text-zinc-400 text-sm">
            Thanh toan tu dong dang phat trien. Lien he Telegram de nang cap thu cong trong 5 phut.
          </p>
        </div>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1a8ec4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Telegram
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    </div>
  )
}
