// =============================================================================
// app/(dashboard)/links/page.tsx
// =============================================================================

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkTable } from '@/components/links/LinkTable'
import { LinkFilters } from '@/components/links/LinkFilters'
import { useLinks } from '@/hooks/useLinks'
import { useUIStore } from '@/store/uiStore'
import { LinkListParams } from '@/types/link'
import { PAGE_SIZE } from '@/lib/constants'

export default function LinksPage() {
  const { openCreateLinkModal } = useUIStore()
  const [params, setParams] = useState<LinkListParams>({
    page: 0,
    size: PAGE_SIZE,
    sortBy: 'createdAt',
    sortDir: 'desc',
  })

  const { data, isLoading } = useLinks(params)

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Links</h2>
          <p className="text-sm text-muted-foreground">
            {data?.totalElements ?? 0} link tổng cộng
          </p>
        </div>
        <Button onClick={openCreateLinkModal} className="gap-2">
          <Plus size={16} />
          Tạo link mới
        </Button>
      </div>

      {/* Filters */}
      <LinkFilters params={params} onChange={setParams} />

      {/* Table */}
      <LinkTable
        links={data?.content ?? []}
        isLoading={isLoading}
        totalPages={data?.totalPages ?? 0}
        currentPage={params.page ?? 0}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
      />
    </div>
  )
}

// =============================================================================
// components/links/PlatformBadge.tsx
// =============================================================================

'use client'

import { Platform } from '@/types/link'
import { PLATFORM_COLORS, PLATFORM_LABELS } from '@/lib/queryClient'
import { cn } from '@/lib/queryClient'

interface Props {
  platform: Platform
  size?: 'xs' | 'sm'
}

export function PlatformBadge({ platform, size = 'sm' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      )}
      style={{
        backgroundColor: PLATFORM_COLORS[platform] + '20',
        color: PLATFORM_COLORS[platform],
      }}
    >
      {PLATFORM_LABELS[platform]}
    </span>
  )
}

// =============================================================================
// components/links/CopyLinkButton.tsx
// =============================================================================

'use client'

import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface Props {
  url: string
}

export function CopyLinkButton({ url }: Props) {
  const { copy, copied } = useCopyToClipboard()

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => copy(url)}
          >
            {copied
              ? <Check size={14} className="text-green-500" />
              : <Copy size={14} />
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Đã sao chép!' : 'Sao chép link'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =============================================================================
// components/links/LinkFilters.tsx
// =============================================================================

'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LinkListParams, Platform } from '@/types/link'
import { PLATFORM_LABELS } from '@/lib/queryClient'
import { useEffect, useState } from 'react'

interface Props {
  params: LinkListParams
  onChange: (params: LinkListParams) => void
}

export function LinkFilters({ params, onChange }: Props) {
  const [searchInput, setSearchInput] = useState(params.search ?? '')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...params, search: searchInput || undefined, page: 0 })
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  return (
    <div className="flex flex-wrap gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm link..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Platform filter */}
      <Select
        value={params.platform ?? 'ALL'}
        onValueChange={(val) =>
          onChange({ ...params, platform: val === 'ALL' ? undefined : val as Platform, page: 0 })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả</SelectItem>
          {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
            <SelectItem key={p} value={p}>{PLATFORM_LABELS[p]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${params.sortBy}-${params.sortDir}`}
        onValueChange={(val) => {
          const [sortBy, sortDir] = val.split('-') as [string, 'asc' | 'desc']
          onChange({ ...params, sortBy: sortBy as any, sortDir, page: 0 })
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
          <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
          <SelectItem value="clickCount-desc">Click nhiều nhất</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
