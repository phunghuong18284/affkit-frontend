// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateLink, type LinkResponse } from '@/hooks/useLinks'
import { useCampaigns } from '@/hooks/useCampaigns'

const schema = z.object({
  title: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface EditLinkModalProps {
  link: LinkResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLinkModal({ link, open, onOpenChange }: EditLinkModalProps) {
  const { mutateAsync: updateLink, isPending } = useUpdateLink()
  const { data: campaignsData } = useCampaigns()
  const campaigns = campaignsData?.content ?? campaignsData?.items ?? campaignsData ?? []

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('none')

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (link) {
      reset({ title: link.title ?? '' })
      setSelectedCampaignId(link.campaignId ?? 'none')
    }
  }, [link, reset])

  const onSubmit = async (data: FormData) => {
    if (!link) return
    try {
      await updateLink({
        id: link.id,
        data: {
          title: data.title || undefined,
          campaignId: selectedCampaignId !== 'none' ? selectedCampaignId : undefined,
        },
      })
      onOpenChange(false)
    } catch {
      // lỗi đã handle trong hook
    }
  }

  const handleClose = () => {
    reset()
    setSelectedCampaignId('none')
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
            <Label>URL gốc</Label>
            <p className="text-sm text-muted-foreground break-all">{link?.originalUrl}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
            <Input
              id="title"
              placeholder="Ví dụ: Áo thun sale 50%"
              {...register('title')}
            />
          </div>

          <div className="space-y-2">
            <Label>Campaign (tùy chọn)</Label>
            <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn campaign..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có campaign</SelectItem>
                {campaigns.map((c: { id: string; name: string }) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}