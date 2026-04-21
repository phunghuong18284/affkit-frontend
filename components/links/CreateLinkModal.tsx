'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

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
import { useCreateLink } from '@/hooks/useLinks'
import { useCampaigns } from '@/hooks/useCampaigns'

const schema = z.object({
  originalUrl: z.string().url('URL không hợp lệ'),
  title: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface CreateLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateLinkModal({ open, onOpenChange }: CreateLinkModalProps) {
  const [createdShortUrl, setCreatedShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('none')

  const { mutateAsync: createLink, isPending } = useCreateLink()
  const { data: campaignsData } = useCampaigns()
  const campaigns = campaignsData?.content ?? campaignsData?.items ?? campaignsData ?? []

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createLink({
        originalUrl: data.originalUrl,
        title: data.title || undefined,
        campaignId: selectedCampaignId !== 'none' ? selectedCampaignId : undefined,
      })
      const shortUrl = result?.shortUrl ?? result?.data?.shortUrl
      if (shortUrl) setCreatedShortUrl(shortUrl)
    } catch {
      // lỗi đã handle trong hook
    }
  }

  const handleCopy = () => {
    if (!createdShortUrl) return
    navigator.clipboard.writeText(createdShortUrl)
    setCopied(true)
    toast.success('Đã copy link!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    reset()
    setCreatedShortUrl(null)
    setCopied(false)
    setSelectedCampaignId('none')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo link mới</DialogTitle>
        </DialogHeader>

        {createdShortUrl ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Link đã được tạo thành công!</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="flex-1 text-sm font-mono truncate">{createdShortUrl}</span>
              <Button size="icon" variant="ghost" onClick={handleCopy}>
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href={createdShortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} />
                </a>
              </Button>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { reset(); setCreatedShortUrl(null); setSelectedCampaignId('none') }}>
                Tạo link khác
              </Button>
              <Button onClick={handleClose}>Xong</Button>
            </div>
          </div>
        ) : (
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
                {isPending ? 'Đang tạo...' : 'Tạo link'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}