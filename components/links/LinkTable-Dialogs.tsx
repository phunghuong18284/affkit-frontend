// =============================================================================
// components/links/LinkTable.tsx
// =============================================================================

'use client'

import Link from 'next/link'
import { MoreHorizontal, BarChart2, Pencil, Trash2, ExternalLink } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LinkResponse } from '@/types/link'
import { PlatformBadge } from './PlatformBadge'
import { CopyLinkButton } from './CopyLinkButton'
import { useDeleteLink } from '@/hooks/useLinks'
import { formatNumber, formatDateTime } from '@/lib/queryClient'
import { useState } from 'react'
import { DeleteLinkDialog } from './DeleteLinkDialog'
import { EditLinkModal } from './EditLinkModal'

interface Props {
  links: LinkResponse[]
  isLoading: boolean
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function LinkTable({ links, isLoading, totalPages, currentPage, onPageChange }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<LinkResponse | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground text-sm">Chưa có link nào.</p>
        <p className="text-muted-foreground text-xs mt-1">Nhấn "+ Tạo link mới" để bắt đầu</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Link</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
              <TableHead className="w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id} className="group">
                {/* Link info */}
                <TableCell>
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate max-w-[240px]">
                        {link.title ?? link.shortCode}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-mono"
                        >
                          {link.shortUrl}
                        </a>
                        <CopyLinkButton url={link.shortUrl} />
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Platform */}
                <TableCell>
                  <PlatformBadge platform={link.platform} />
                </TableCell>

                {/* Clicks */}
                <TableCell className="text-right font-semibold">
                  {formatNumber(link.clickCount)}
                </TableCell>

                {/* Date */}
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {formatDateTime(link.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem asChild>
                        <Link href={`/links/${link.id}`} className="gap-2">
                          <BarChart2 size={14} />
                          Xem analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <ExternalLink size={14} />
                          Link gốc
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setEditingLink(link)}
                        className="gap-2"
                      >
                        <Pencil size={14} />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingId(link.id)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 size={14} />
                        Xóa link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <DeleteLinkDialog
        linkId={deletingId}
        onClose={() => setDeletingId(null)}
      />
      <EditLinkModal
        link={editingLink}
        onClose={() => setEditingLink(null)}
      />
    </>
  )
}

// =============================================================================
// components/links/DeleteLinkDialog.tsx
// =============================================================================

'use client'

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useDeleteLink } from '@/hooks/useLinks'

interface Props {
  linkId: string | null
  onClose: () => void
}

export function DeleteLinkDialog({ linkId, onClose }: Props) {
  const { mutate: deleteLink, isPending } = useDeleteLink()

  const handleConfirm = () => {
    if (!linkId) return
    deleteLink(linkId, { onSuccess: onClose })
  }

  return (
    <Dialog open={!!linkId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xóa link</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Link sẽ bị xóa vĩnh viễn cùng toàn bộ dữ liệu analytics.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xóa...</>
            ) : 'Xóa link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// components/links/EditLinkModal.tsx — Stub (mở rộng sau)
// =============================================================================

'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LinkResponse } from '@/types/link'

interface Props {
  link: LinkResponse | null
  onClose: () => void
}

export function EditLinkModal({ link, onClose }: Props) {
  return (
    <Dialog open={!!link} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa link</DialogTitle>
        </DialogHeader>
        {/* EditLinkForm here */}
        <p className="text-sm text-muted-foreground">Đang phát triển...</p>
      </DialogContent>
    </Dialog>
  )
}
