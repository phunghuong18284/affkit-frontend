// =============================================================================
// app/(auth)/register/page.tsx
// =============================================================================

import { RegisterForm } from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký — AffKit',
}

export default function RegisterPage() {
  return <RegisterForm />
}

// =============================================================================
// app/(auth)/resend-verification/page.tsx
// =============================================================================

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/lib/api/auth'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Email không đúng định dạng'),
})
type Input = z.infer<typeof schema>

export default function ResendVerificationPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<Input>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Input) => {
    setIsLoading(true)
    try {
      await authApi.resendVerification(data.email)
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
          <CardTitle>Email đã được gửi!</CardTitle>
          <CardDescription>
            Kiểm tra hộp thư của <strong>{getValues('email')}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Không nhận được?{' '}
            <button
              onClick={() => setSent(false)}
              className="text-primary hover:underline"
            >
              Gửi lại
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
        <CardTitle className="text-2xl font-bold">Gửi lại email xác nhận</CardTitle>
        <CardDescription>
          Nhập email bạn đã dùng để đăng ký
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
            {isLoading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang gửi...</>
              : 'Gửi email xác nhận'
            }
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">← Quay về đăng nhập</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
