//ts-nocheck
// app/dashboard/settings/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Key, CheckCircle2, Trash2, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useUpdateProfile, useChangePassword } from '@/hooks/useProfile'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

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

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const queryClient = useQueryClient()

  const [apiKey, setApiKey] = useState('')
  const [savingKey, setSavingKey] = useState(false)
  const [deletingKey, setDeletingKey] = useState(false)

  const [telegramLinked, setTelegramLinked] = useState(false)
  const [telegramCode, setTelegramCode] = useState<string | null>(null)
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [unlinkingTelegram, setUnlinkingTelegram] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { fullName: profile?.fullName ?? '' },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    async function fetchTelegramStatus() {
      try {
        const res = await api.get('/users/me/telegram-status')
        const data = res as any
        setTelegramLinked(data.linked === true)
      } catch {
        // ignore
      }
    }
    fetchTelegramStatus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      if (countdownRef.current) clearInterval(countdownRef.current)
      return
    }
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!)
          setTelegramCode(null)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [countdown])

  async function onGenerateTelegramCode() {
    setTelegramLoading(true)
    try {
      const res = await api.post('/users/me/telegram-link', {})
      const data = res as any
      setTelegramCode(data.code)
      setCountdown(600)
    } catch {
      toast.error('Không tạo được mã liên kết')
    } finally {
      setTelegramLoading(false)
    }
  }

  async function onUnlinkTelegram() {
    setUnlinkingTelegram(true)
    try {
      await api.delete('/users/me/telegram-link')
      setTelegramLinked(false)
      setTelegramCode(null)
      setCountdown(0)
      toast.success('Đã hủy liên kết Telegram')
    } catch {
      toast.error('Hủy liên kết thất bại')
    } finally {
      setUnlinkingTelegram(false)
    }
  }

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  async function onUpdateProfile(data: ProfileForm) {
    await updateProfile.mutateAsync(data as any)
  }

  async function onChangePassword(data: PasswordForm) {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      passwordForm.reset()
    } catch {
      // error toast handled in hook
    }
  }

  async function onSaveApiKey() {
    if (!apiKey.trim()) {
      toast.error('Vui lòng nhập API key')
      return
    }
    setSavingKey(true)
    try {
      await api.put('/users/me/accesstrade-key', { apiKey: apiKey.trim() })
      toast.success('Đã lưu API key AccessTrade')
      setApiKey('')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    } catch {
      toast.error('Lưu API key thất bại')
    } finally {
      setSavingKey(false)
    }
  }

  async function onDeleteApiKey() {
    setDeletingKey(true)
    try {
      await api.delete('/users/me/accesstrade-key')
      toast.success('Đã xóa API key AccessTrade')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    } catch {
      toast.error('Xóa API key thất bại')
    } finally {
      setDeletingKey(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const plan = profile?.plan ?? 'FREE'
  const hasApiKey = profile?.hasAccessTradeKey ?? false

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
            <span>{profile?.email}</span>
            <span>·</span>
            <Badge variant={PLAN_VARIANT[plan]}>{PLAN_LABEL[plan]}</Badge>
            {plan === 'PRO' && profile?.planExpiresAt && (
              <span className={`text-xs ${
                new Date(profile.planExpiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
                  ? 'text-yellow-500'
                  : 'text-muted-foreground'
              }`}>
                · Hết hạn: {new Date(profile.planExpiresAt).toLocaleDateString('vi-VN')}
              </span>
            )}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key size={18} />
            Kết nối AccessTrade
          </CardTitle>
          <CardDescription>
            Nhập API key AccessTrade của bạn để xem hoa hồng trực tiếp trong AffKit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasApiKey ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Đã kết nối AccessTrade</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDeleteApiKey}
                disabled={deletingKey}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {deletingKey ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span className="ml-1">Xóa</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key AccessTrade</Label>
                <Input
                  id="apiKey"
                  type="text"
                  autoComplete="off"
                  placeholder="Dán API key từ pub2.accesstrade.vn vào đây..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Lấy API key tại: pub2.accesstrade.vn → Tools → API → Access Key
              </p>
              <Button onClick={onSaveApiKey} disabled={savingKey || !apiKey.trim()}>
                {savingKey && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu API key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send size={18} />
            Liên kết Telegram
          </CardTitle>
          <CardDescription>
            Liên kết tài khoản Telegram để bot dùng đúng API key của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {telegramLinked ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Đã liên kết Telegram</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onUnlinkTelegram}
                disabled={unlinkingTelegram}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {unlinkingTelegram ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span className="ml-1">Hủy liên kết</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {telegramCode ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted text-center space-y-1">
                    <p className="text-xs text-muted-foreground">Mã liên kết của bạn</p>
                    <p className="text-3xl font-bold tracking-widest">{telegramCode}</p>
                    <p className="text-xs text-muted-foreground">
                      Hết hạn sau {minutes}:{seconds.toString().padStart(2, '0')}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border text-sm space-y-1">
                    <p className="font-medium">Hướng dẫn:</p>
                    <p className="text-muted-foreground">
                      1. Mở Telegram, tìm <span className="font-mono font-medium">@affkit_vn_bot</span>
                    </p>
                    <p className="text-muted-foreground">
                      2. Gửi lệnh: <span className="font-mono font-medium">/link {telegramCode}</span>
                    </p>
                    <p className="text-muted-foreground">
                      3. Bot sẽ xác nhận liên kết thành công
                    </p>
                  </div>
                  <Button variant="outline" onClick={onGenerateTelegramCode} disabled={telegramLoading}>
                    Tạo mã mới
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Nhấn nút bên dưới để tạo mã liên kết, sau đó gửi mã vào bot Telegram.
                  </p>
                  <Button onClick={onGenerateTelegramCode} disabled={telegramLoading}>
                    {telegramLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tạo mã liên kết
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
