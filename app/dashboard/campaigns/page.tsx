'use client'

import { useState } from 'react'
import { Plus, Trash2, Link2, MousePointerClick, Calendar, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { useCampaigns, useDeleteCampaign, type CampaignResponse, type CampaignStatus } from '@/hooks/useCampaigns'

function StatusBadge({ status }: { status: CampaignStatus }) {
  const map = {
    UPCOMING: { label: 'Sap dien ra', className: 'bg-yellow-500/20 text-yellow-400' },
    ACTIVE:   { label: 'Dang chay',   className: 'bg-green-500/20 text-green-400' },
    ENDED:    { label: 'Da ket thuc', className: 'bg-muted text-muted-foreground' },
  }
  const { label, className } = map[status] ?? map.ENDED
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
      {label}
    </span>
  )
}

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN')
}

function CampaignCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-lg space-y-3">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export default function CampaignsPage() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError } = useCampaigns()
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign()

  const campaigns: CampaignResponse[] = data?.content ?? data?.items ?? data ?? []

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
      return
    }
    deleteCampaign(id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Campaigns</h2>
          <p className="text-sm text-muted-foreground">Quan ly campaign affiliate cua ban</p>
        </div>
        <Button className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Tao campaign
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-sm text-destructive">
          Cannot load campaigns. Please try again.
        </div>
      )}

      {!isLoading && !isError && campaigns.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground text-sm">No campaigns yet.</p>
          <p className="text-muted-foreground text-xs mt-1">
            Click Tao campaign to start
          </p>
        </div>
      )}

      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/20 transition-colors space-y-3 cursor-pointer"
              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-1">
                  <StatusBadge status={campaign.status} />
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </div>

              {campaign.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Link2 size={12} />
                  {campaign.linkCount ?? 0} links
                </span>
                <span className="flex items-center gap-1">
                  <MousePointerClick size={12} />
                  {campaign.totalClicks ?? 0} clicks
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {confirmDeleteId === campaign.id && (
                  <span className="text-xs text-destructive">Click again to delete</span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(campaign.id)
                  }}
                  className={`gap-1 text-xs ${confirmDeleteId === campaign.id ? 'text-destructive hover:text-destructive' : 'text-muted-foreground'}`}
                >
                  <Trash2 size={13} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCampaignModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}