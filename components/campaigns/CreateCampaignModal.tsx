'use client'

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
import { Textarea } from '@/components/ui/textarea'
import { useCreateCampaign } from '@/hooks/useCampaigns'

// ── Schema ─────────────────────────────────────────
const schema = z.object({
  name: z.string().min(1, 'Tên campaign không được để trống'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})
type FormData = z.infer<typeof schema>

// ── Props ──────────────────────────────────────────
interface CreateCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── Component ──────────────────────────────────────
export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const { mutateAsync: createCampaign, isPending } = useCreateCampaign()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await createCampaign({
        name: data.name,
        description: data.description || undefined,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      })
      handleClose()
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
          <DialogTitle>Tạo campaign mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên campaign *</Label>
            <Input
              id="name"
              placeholder="Ví dụ: Sale 11/11 Shopee 2026"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về campaign này..."
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang tạo...' : 'Tạo campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}