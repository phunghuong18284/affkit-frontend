'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateLink, type LinkResponse } from '@/hooks/useLinks'

// ── Schema ─────────────────────────────────────────
const schema = z.object({
  originalUrl: z.string().url('URL không hợp lệ'),
  title: z.string().optional(),
})
type FormData = z.infer<typeof schema>

// ── Props ──────────────────────────────────────────
interface EditLinkModalProps {
  link: LinkResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── Component ──────────────────────────────────────
export function EditLinkModal({ link, open, onOpenChange }: EditLinkModalProps) {
  const { mutateAsync: updateLink, isPending } = useUpdateLink()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Pre-fill form khi mở modal
  useEffect(() => {
    if (link) {
      reset({
        originalUrl: link.originalUrl,
        title: link.title ?? '',
      })
    }
  }, [link, reset])

  const onSubmit = async (data: FormData) => {
    if (!link) return
    try {
      await updateLink({
        id: link.id,
        data: {
          originalUrl: data.originalUrl,
          title: data.title || undefined,
        },
      })
      onOpenChange(false)
    } catch {
      // lỗi đã handle trong hook
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa link</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">URL gốc *</Label>
            <Input
              id="originalUrl"
              placeholder="https://shopee.vn/product/..."
              {...register('originalUrl')}
            />
            {errors.originalUrl && (
              <p className="text-xs text-destructive">{errors.originalUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
            <Input
              id="title"
              placeholder="Ví dụ: Áo thun sale 50%"
              {...register('title')}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}