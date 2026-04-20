'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const { login } = useAuthStore()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token không hợp lệ.')
      return
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then((res: any) => {
        // Auto login nếu backend trả accessToken
        if (res?.accessToken) {
          login({ email: res.email } as any, res.accessToken)
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setTimeout(() => router.push('/login'), 3000)
        }
        setStatus('success')
        setMessage('Email đã được xác nhận thành công!')
      })
      .catch((err: any) => {
        setStatus('error')
        setMessage(err?.message ?? 'Token đã hết hạn hoặc không hợp lệ.')
      })
  }, [token, router])

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
            <p className="text-sm text-muted-foreground">
              Đang chuyển hướng...
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Đăng nhập ngay</Link>
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