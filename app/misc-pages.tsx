// =============================================================================
// app/not-found.tsx — 404 Page
// =============================================================================

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <h1 className="text-2xl font-bold text-foreground">Trang không tồn tại</h1>
        <p className="text-muted-foreground">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link href="/dashboard">Về Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// app/error.tsx — Global Error Boundary
// =============================================================================

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl">⚠️</p>
        <h2 className="text-xl font-bold text-foreground">Đã có lỗi xảy ra</h2>
        <p className="text-sm text-muted-foreground">
          {error.message ?? 'Lỗi không xác định. Vui lòng thử lại.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" asChild>
            <a href="/dashboard">Về Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// app/link-deleted/page.tsx — 410 Link Deleted
// =============================================================================

import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LinkDeletedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm">
        <XCircle className="mx-auto h-16 w-16 text-destructive/60" />
        <h1 className="text-2xl font-bold text-foreground">Link không còn tồn tại</h1>
        <p className="text-muted-foreground text-sm">
          Link này đã bị xóa bởi người tạo. Vui lòng liên hệ nguồn chia sẻ để lấy link mới.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// app/go/[shortCode]/page.tsx — Redirect fallback (Nginx xử lý trước)
// Chỉ chạy nếu Nginx không bắt được route /go/*
// =============================================================================

import { redirect } from 'next/navigation'

interface Props {
  params: { shortCode: string }
}

export default async function GoPage({ params }: Props) {
  const { shortCode } = params

  try {
    // Gọi trực tiếp backend để lấy redirect URL
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? 'http://localhost:8080/go'}/${shortCode}`,
      {
        method: 'GET',
        redirect: 'manual',
        cache: 'no-store',
      }
    )

    // Backend trả về 302 → lấy Location header
    const location = res.headers.get('location')
    if (location) {
      redirect(location)
    }
  } catch {
    // Fallback
  }

  redirect('/link-deleted')
}
