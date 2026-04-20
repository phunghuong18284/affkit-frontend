'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  newPassword: z.string().min(8, 'Mat khau toi thieu 8 ky tu'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Mat khau xac nhan khong khop',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (!token) {
    return (
      <Card className="border-border bg-card text-center">
        <CardHeader>
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle>Link khong hop le</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/forgot-password">Thu lai</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="border-border bg-card text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle>Mat khau da duoc dat lai!</CardTitle>
          <CardDescription>Vui long dang nhap lai voi mat khau moi.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push('/login')}>
            Dang nhap ngay
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="border-border bg-card text-center">
        <CardHeader>
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle>That bai</CardTitle>
          <CardDescription>{errorMsg}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/forgot-password">Gui lai email</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      })
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Link da het han hoac khong hop le.')
      setStatus('error')
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Dat lai mat khau</CardTitle>
        <CardDescription>Nhap mat khau moi cua ban</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mat khau moi</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Toi thieu 8 ky tu"
              {...register('newPassword')}
              className={errors.newPassword ? 'border-destructive' : ''}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xac nhan mat khau</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhap lai mat khau moi"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Dang xu ly...</>
            ) : (
              'Dat lai mat khau'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}