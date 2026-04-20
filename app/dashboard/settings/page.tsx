// app/dashboard/settings/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useUpdateProfile, useChangePassword } from '@/hooks/useProfile'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  fullName: z.string().min(2, 'Tối thiểu 2 ký tự').max(50, 'Tối đa 50 ký tự'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Nhập mật khẩu hiện tại'),
  newPassword: z.string().min(8, 'Tối thiểu 8 ký tự'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// ─── Plan badge ───────────────────────────────────────────────────────────────

const PLAN_LABEL: Record<string, string> = {
  FREE: 'Free',
  PRO: 'Pro',
  BUSINESS: 'Business',
}

const PLAN_VARIANT: Record<string, 'secondary' | 'default' | 'destructive'> = {
  FREE: 'secondary',
  PRO: 'default',
  BUSINESS: 'destructive',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { fullName: profile?.fullName ?? '' },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onUpdateProfile(data: ProfileForm) {
    await updateProfile.mutateAsync(data)
  }

  async function onChangePassword(data: PasswordForm) {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      passwordForm.reset()
    } catch {
      // error toast đã xử lý trong hook
    }
  }

  // ─── Loading skeleton ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  const plan = profile?.plan ?? 'FREE'

  return (
    <div className="max-w-2xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      {/* ── Card profile ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            <span>{profile?.email}</span>
            <span>·</span>
            <Badge variant={PLAN_VARIANT[plan]}>{PLAN_LABEL[plan]}</Badge>
            {!profile?.emailVerified && (
              <span className="text-yellow-600 text-xs">⚠ Email chưa xác nhận</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Tên hiển thị</Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                {...profileForm.register('fullName')}
                className={profileForm.formState.errors.fullName ? 'border-destructive' : ''}
              />
              {profileForm.formState.errors.fullName && (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.fullName.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={updateProfile.isPending || !profileForm.formState.isDirty}
            >
              {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Card đổi mật khẩu ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Mật khẩu mới tối thiểu 8 ký tự</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register('currentPassword')}
                className={passwordForm.formState.errors.currentPassword ? 'border-destructive' : ''}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register('newPassword')}
                className={passwordForm.formState.errors.newPassword ? 'border-destructive' : ''}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register('confirmPassword')}
                className={passwordForm.formState.errors.confirmPassword ? 'border-destructive' : ''}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đổi mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
