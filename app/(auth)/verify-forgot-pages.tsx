// =============================================================================
// app/(auth)/verify-email/page.tsx
// =============================================================================

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api/auth'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token không hợp lệ.')
      return
    }

    authApi.verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('Email đã được xác nhận thành công!')
        // Auto redirect sau 3 giây
        setTimeout(() => router.push('/login'), 3000)
      })
      .catch((err) => {
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
              Đang chuyển hướng về trang đăng nhập...
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
              <Link href="/resend-verification">Gửi lại email xác nhận</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// app/(auth)/forgot-password/page.tsx
// =============================================================================
// (separate file in real project)

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { forgotPasswordSchema } from '@/lib/validators'
import { authApi } from '@/lib/api/auth'
import { toast } from 'sonner'
import { z } from 'zod'

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword(data.email)
      setSent(true)
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="border-border bg-card text-center">
        <CardHeader>
          <Mail className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle>Kiểm tra email của bạn</CardTitle>
          <CardDescription>
            Chúng tôi đã gửi link đặt lại mật khẩu đến{' '}
            <strong>{getValues('email')}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
            <button
              onClick={() => setSent(false)}
              className="text-primary hover:underline"
            >
              thử lại
            </button>
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Quay về đăng nhập</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quên mật khẩu?</CardTitle>
        <CardDescription>
          Nhập email và chúng tôi sẽ gửi link đặt lại mật khẩu
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang gửi...</>
            ) : (
              'Gửi link đặt lại mật khẩu'
            )}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">← Quay về đăng nhập</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
