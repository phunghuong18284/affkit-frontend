import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/common/Providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'AffKit — Quản lý link affiliate thông minh',
  description: 'Rút gọn link, theo dõi analytics, auto-convert sang affiliate link Shopee / Lazada / Tiki. Công cụ all-in-one dành cho affiliate Việt Nam.',
  keywords: 'affiliate marketing, rút gọn link, link affiliate, shopee affiliate, lazada affiliate, tiki affiliate, theo dõi click',
  authors: [{ name: 'AffKit' }],
  openGraph: {
    title: 'AffKit — Quản lý link affiliate thông minh',
    description: 'Rút gọn link, theo dõi analytics, auto-convert sang affiliate link Shopee / Lazada / Tiki. Miễn phí 30 links.',
    url: 'https://affkit.vn',
    siteName: 'AffKit',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: 'https://affkit.vn/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AffKit — Quản lý link affiliate thông minh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AffKit — Quản lý link affiliate thông minh',
    description: 'Rút gọn link, theo dõi analytics, auto-convert sang affiliate link Shopee / Lazada / Tiki.',
    images: ['https://affkit.vn/og-image.png'],
  },
  metadataBase: new URL('https://affkit.vn'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  )
}