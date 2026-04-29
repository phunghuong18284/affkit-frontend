// app/(auth)/register/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'
import { registerSchema, RegisterInput } from '@/lib/validators'
import { PasswordStrengthBar } from '@/components/auth/PasswordStrengthBar'
import api from '@/lib/api'

export default function RegisterPage() {
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')

  if (done) {
    return <ConfirmScreen email={email} />
  }

  return <RegisterFormWrapper onSuccess={(e) => { setEmail(e); setDone(true) }} />
}

function RegisterFormWrapper({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password', '')

  async function onSubmit(data: RegisterInput) {
    setIsSubmitting(true)
    try {
      await api.post('/auth/register', {
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      })
      onSuccess(data.email)
    } catch (err: any) {
      const msg = err?.message ?? err?.response?.data?.error?.message
      toast.error(msg ?? 'Đăng ký thất bại. Thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
        <CardDescription>Miễn phí mãi mãi — Không cần thẻ tín dụng</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              {...register('fullName')}
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 8 ký tự"
                autoComplete="new-password"
                {...register('password')}
                className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
            <PasswordStrengthBar password={passwordValue} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản miễn phí'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <Link href="/terms" className="underline hover:text-foreground">
              Điều khoản sử dụng
            </Link>
          </p>

          <p className="text-sm text-center text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

function ConfirmScreen({ email }: { email: string }) {
  const [resending, setResending] = useState(false)

  async function handleResend() {
    setResending(true)
    try {
      await api.post('/auth/resend-verification', { email })
      toast.success('Đã gửi lại email xác nhận')
    } catch (err: any) {
      const msg = err?.message ?? err?.response?.data?.error?.message
      toast.error(msg ?? 'Thử lại sau')
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center space-y-2">
        <div className="text-5xl">📧</div>
        <CardTitle className="text-2xl font-bold">Kiểm tra email</CardTitle>
        <CardDescription>
          Chúng tôi đã gửi link xác nhận đến{' '}
          <span className="font-medium text-foreground">{email}</span>.
          <br />
          Click vào link trong email để kích hoạt tài khoản.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          disabled={resending}
          onClick={handleResend}
        >
          {resending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi lại email xác nhận'
          )}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Quay về đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}