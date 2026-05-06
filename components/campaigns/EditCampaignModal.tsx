// @ts-nocheck
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateCampaign, type CampaignResponse } from '@/hooks/useCampaigns'

const schema = z.object({
  name: z.string().min(1, 'Ten campaign khong duoc de trong'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: CampaignResponse | null
}

export function EditCampaignModal({ open, onOpenChange, campaign }: Props) {
  const { mutateAsync: updateCampaign, isPending } = useUpdateCampaign()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (campaign) {
      reset({
        name: campaign.name,
        description: campaign.description ?? '',
        startDate: campaign.startDate ?? '',
        endDate: campaign.endDate ?? '',
      })
    }
  }, [campaign, reset])

  const onSubmit = async (data: FormData) => {
    if (!campaign) return
    try {
      await updateCampaign({
        id: campaign.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
        },
      })
      onOpenChange(false)
    } catch {
      // handled in hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sua campaign</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Ten campaign *</Label>
            <Input id="edit-name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Mo ta (tuy chon)</Label>
            <Textarea id="edit-description" rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Ngay bat dau</Label>
              <Input id="edit-startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">Ngay ket thuc</Label>
              <Input id="edit-endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Dang luu...' : 'Luu thay doi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}