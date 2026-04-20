// =============================================================================
// app/(dashboard)/campaigns/page.tsx
// =============================================================================

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CampaignGrid } from '@/components/campaigns/CampaignGrid'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { useCampaigns } from '@/hooks/useCampaigns'
import { CampaignListParams } from '@/types/analytics-campaign'

export default function CampaignsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [params] = useState<CampaignListParams>({ page: 0, size: 12 })

  const { data, isLoading } = useCampaigns(params)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Campaigns</h2>
          <p className="text-sm text-muted-foreground">
            {data?.totalElements ?? 0} campaign
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={16} />
          Tạo campaign
        </Button>
      </div>

      <CampaignGrid
        campaigns={data?.content ?? []}
        isLoading={isLoading}
      />

      <CreateCampaignModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

// =============================================================================
// components/campaigns/CampaignStatusBadge.tsx
// =============================================================================

'use client'

import { CampaignStatus } from '@/types/analytics-campaign'
import { cn } from '@/lib/queryClient'

const STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  UPCOMING: { label: 'Sắp diễn ra', className: 'bg-blue-500/10 text-blue-500' },
  ACTIVE:   { label: 'Đang hoạt động', className: 'bg-green-500/10 text-green-500' },
  ENDED:    { label: 'Đã kết thúc', className: 'bg-muted text-muted-foreground' },
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', className)}>
      {label}
    </span>
  )
}

// =============================================================================
// components/campaigns/CampaignCard.tsx
// =============================================================================

'use client'

import Link from 'next/link'
import { Calendar, Link2, MousePointerClick, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { CampaignResponse } from '@/types/analytics-campaign'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import { formatNumber, formatDate } from '@/lib/queryClient'
import { useDeleteCampaign } from '@/hooks/useCampaigns'

interface Props {
  campaign: CampaignResponse
}

export function CampaignCard({ campaign }: Props) {
  const { mutate: deleteCampaign } = useDeleteCampaign()

  return (
    <Card className="border-border bg-card hover:border-primary/30 transition-colors group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/campaigns/${campaign.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {campaign.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <CampaignStatusBadge status={campaign.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="gap-2">
                  <Pencil size={13} />Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  onClick={() => deleteCampaign(campaign.id)}
                >
                  <Trash2 size={13} />Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {campaign.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {campaign.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Link2 size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{campaign.linkCount}</span>
            <span className="text-muted-foreground text-xs">links</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MousePointerClick size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{formatNumber(campaign.totalClicks)}</span>
            <span className="text-muted-foreground text-xs">clicks</span>
          </div>
        </div>

        {/* Date range */}
        {(campaign.startDate || campaign.endDate) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>
              {campaign.startDate ? formatDate(campaign.startDate) : '—'}
              {' → '}
              {campaign.endDate ? formatDate(campaign.endDate) : '∞'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// components/campaigns/CampaignGrid.tsx
// =============================================================================

'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { CampaignResponse } from '@/types/analytics-campaign'
import { CampaignCard } from './CampaignCard'

interface Props {
  campaigns: CampaignResponse[]
  isLoading: boolean
}

export function CampaignGrid({ campaigns, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground text-sm">Chưa có campaign nào.</p>
        <p className="text-muted-foreground text-xs mt-1">
          Nhấn "+ Tạo campaign" để tổ chức links của bạn
        </p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}

// =============================================================================
// components/campaigns/CreateCampaignModal.tsx
// =============================================================================

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCampaignSchema, CreateCampaignInput } from '@/lib/validators'
import { useCreateCampaign } from '@/hooks/useCampaigns'

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateCampaignModal({ open, onClose }: Props) {
  const { mutate: createCampaign, isPending } = useCreateCampaign()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCampaignInput>({
    resolver: zodResolver(createCampaignSchema),
  })

  const onSubmit = (data: CreateCampaignInput) => {
    createCampaign(data, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo campaign mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên campaign *</Label>
            <Input
              id="name"
              placeholder="Ví dụ: Flash Sale Tháng 4"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả{' '}
              <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về campaign..."
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
              {errors.endDate && (
                <p className="text-xs text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang tạo...</>
              ) : 'Tạo campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
