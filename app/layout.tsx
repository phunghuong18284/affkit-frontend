import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/common/Providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'AffKit — Rút gọn & theo dõi link affiliate',
  description: 'Tạo link rút gọn, theo dõi click, quản lý campaign affiliate hiệu quả.',
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