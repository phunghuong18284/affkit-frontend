'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import api from '@/lib/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email('Email khong hop le'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email })
      setSentEmail(data.email)
      setSent(true)
    } catch {
      toast.error('Co loi xay ra. Vui long thu lai.')
    }
  }

  if (sent) {
    return (
      <Card className="border-border bg-card text-center">
        <CardHeader>
          <Mail className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle>Kiem tra email cua ban</CardTitle>
          <CardDescription>
            Chung toi da gui link dat lai mat khau den <strong>{sentEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Khong nhan duoc email? Kiem tra thu muc spam hoac{' '}
            <button onClick={() => setSent(false)} className="text-primary hover:underline">
              thu lai
            </button>
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Quay ve dang nhap</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quen mat khau?</CardTitle>
        <CardDescription>
          Nhap email va chung toi se gui link dat lai mat khau
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Dang gui...</>
            ) : (
              'Gui link dat lai mat khau'
            )}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">Quay ve dang nhap</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}