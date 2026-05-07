'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const { login } = useAuthStore()
  const calledRef = useRef(false)

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token không hợp lệ.')
      return
    }

    if (calledRef.current) return
    calledRef.current = true

    api.get(`/auth/verify-email?token=${token}`)
      .then((res: any) => {
        const accessToken = res?.accessToken
        if (accessToken) {
          const user = {
            id: res?.id ?? '',
            email: res?.email ?? '',
            fullName: res?.fullName ?? '',
            plan: res?.plan ?? 'FREE',
            isVerified: true,
            createdAt: res?.createdAt ?? '',
          }
          login(user, accessToken)
          setStatus('success')
          setMessage('Email đã được xác nhận thành công!')
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setStatus('success')
          setMessage('Email đã được xác nhận thành công!')
          setTimeout(() => router.push('/login'), 2000)
        }
      })
      .catch((err: any) => {
        setStatus('error')
        const code = err?.code ?? err?.errorCode
        if (code === 'TOKEN_EXPIRED') {
          setMessage('Link xác nhận đã hết hạn. Vui lòng yêu cầu gửi lại email.')
        } else if (code === 'TOKEN_INVALID') {
          setMessage('Link xác nhận không hợp lệ hoặc đã được dùng rồi.')
        } else {
          setMessage('Có lỗi xảy ra. Vui lòng thử lại.')
        }
      })
  }, [token])

  return (
    <Card className="border-border bg-card text-center">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Xác nhận Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Đang xác nhận email của bạn...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <p className="text-foreground font-medium">{message}</p>
            <p className="text-sm text-muted-foreground">Đang chuyển hướng...</p>
            <Button asChild className="w-full">
              <Link href="/dashboard">Vào Dashboard</Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <p className="text-foreground font-medium">{message}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Quay về đăng nhập</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}