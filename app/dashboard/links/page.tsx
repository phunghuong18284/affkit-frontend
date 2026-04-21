'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, ExternalLink, Search, Pencil, BarChart2, ChevronLeft, ChevronRight, Zap, Link2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateLinkModal } from '@/components/links/CreateLinkModal'
import { EditLinkModal } from '@/components/links/EditLinkModal'
import { useLinks, useDeleteLink, useCreateLink, type LinkResponse } from '@/hooks/useLinks'
import { useConvertLink } from '@/hooks/useConvertLink'

const PAGE_SIZE = 10

function PlatformBadge({ platform }: { platform: string | null }) {
  if (!platform) return null
  const colors: Record<string, string> = {
    SHOPEE:   'bg-orange-500/20 text-orange-400',
    LAZADA:   'bg-blue-500/20 text-blue-400',
    TIKTOK:   'bg-pink-500/20 text-pink-400',
    FACEBOOK: 'bg-blue-600/20 text-blue-300',
    TIKI:     'bg-blue-400/20 text-blue-300',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[platform] ?? 'bg-muted text-muted-foreground'}`}>
      {platform.toUpperCase()}
    </span>
  )
}

function LinkRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export default function LinksPage() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<LinkResponse | null>(null)
  const [convertUrl, setConvertUrl] = useState('')
  const [linkSaved, setLinkSaved] = useState(false)

  const { data, isLoading, isError } = useLinks({ search: search || undefined, page, size: PAGE_SIZE })
  const { mutate: deleteLink, isPending: isDeleting } = useDeleteLink()
  const { mutateAsync: createLink, isPending: isCreating } = useCreateLink()
  const { convert, isLoading: isConverting, result: convertResult, error: convertError, reset: resetConvert } = useConvertLink()

  const links: LinkResponse[] = data?.content ?? data?.items ?? data ?? []
  const totalPages: number = data?.totalPages ?? 1
  const totalElements: number = data?.totalElements ?? links.length

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Da copy!')
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
      return
    }
    deleteLink(id)
    setConfirmDeleteId(null)
  }

  const handleConvert = () => {
    if (!convertUrl.trim()) return
    convert(convertUrl.trim())
    setLinkSaved(false)
  }

  const handleConvertReset = () => {
    setConvertUrl('')
    setLinkSaved(false)
    resetConvert()
  }

  const handleSaveAsNewLink = async () => {
    if (!convertResult) return
    await createLink({
      originalUrl: convertResult.originalUrl,
      title: convertResult.platform + ' link',
      affiliateUrl: convertResult.affiliateUrl,
    })
    setLinkSaved(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Links</h2>
          <p className="text-sm text-muted-foreground">Quan ly link rut gon cua ban</p>
        </div>
        <Button className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Tao link moi
        </Button>
      </div>

      {/* Convert Link Box */}
      <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <span className="text-sm font-medium text-foreground">Convert sang Affiliate Link</span>
          <span className="text-xs text-muted-foreground">(Tiki, Lazada, TikTok)</span>
        </div>

        {!convertResult ? (
          <div className="flex gap-2">
            <Input
              placeholder="Paste link Tiki / Lazada / TikTok vao day..."
              value={convertUrl}
              onChange={(e) => {
                setConvertUrl(e.target.value)
                if (convertError) resetConvert()
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
              className="flex-1"
            />
            <Button
              onClick={handleConvert}
              disabled={isConverting || !convertUrl.trim()}
              className="gap-2 shrink-0"
            >
              {isConverting ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <Link2 size={15} />
              )}
              {isConverting ? 'Dang convert...' : 'Convert'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Affiliate URL result */}
            <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border border-border">
              <PlatformBadge platform={convertResult.platform} />
              <span className="text-sm text-blue-400 flex-1 truncate">{convertResult.affiliateUrl}</span>
              <Button
                size="sm" variant="outline"
                onClick={() => handleCopy(convertResult.affiliateUrl)}
                className="shrink-0 gap-1"
              >
                <Copy size={13} />
                Copy
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground truncate max-w-[60%]">
                Tu: {convertResult.originalUrl}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveAsNewLink}
                  disabled={isCreating || linkSaved}
                  className="gap-1 shrink-0"
                >
                  <Save size={13} />
                  {linkSaved ? 'Da luu!' : isCreating ? 'Dang luu...' : 'Luu vao danh sach'}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleConvertReset} className="text-xs h-7">
                  Convert link khac
                </Button>
              </div>
            </div>
          </div>
        )}

        {convertError && (
          <p className="text-xs text-destructive">{convertError}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tim kiem link..."
          className="pl-9"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_80px_200px_160px] gap-4 px-4 py-2 bg-muted/50 text-xs text-muted-foreground font-medium">
          <span>LINK</span>
          <span>SHORT URL</span>
          <span>CLICKS</span>
          <span>AFFILIATE</span>
          <span></span>
        </div>

        {isLoading && (
          <>
            <LinkRowSkeleton />
            <LinkRowSkeleton />
            <LinkRowSkeleton />
          </>
        )}

        {isError && (
          <div className="text-center py-12 text-sm text-destructive">
            Cannot load links. Please try again.
          </div>
        )}

        {!isLoading && !isError && links.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No links yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Click "+ Tao link moi" to start</p>
          </div>
        )}

        {links.map((link) => (
          <div
            key={link.id}
            className="grid grid-cols-[1fr_140px_80px_200px_160px] gap-4 px-4 py-3 border-t border-border items-center hover:bg-muted/30 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {link.title ?? 'No title'}
                </span>
                <PlatformBadge platform={link.platform} />
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                {link.originalUrl}
              </span>
            </div>

            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-blue-400 truncate">{link.shortUrl ?? link.shortCode}</span>
              <button
                onClick={() => handleCopy(link.shortUrl)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <Copy size={13} />
              </button>
            </div>

            <span className="text-sm text-foreground">{link.totalClicks ?? 0}</span>

            {/* Cot Affiliate */}
            <div className="min-w-0">
              {link.affiliateUrl ? (
                <div className="flex items-center gap-1">
                  <a
                    href={link.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-400 truncate hover:underline block max-w-[160px]"
                  >
                    {link.affiliateUrl}
                  </a>
                  <button
                    onClick={() => handleCopy(link.affiliateUrl!)}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>

            <div className="flex items-center gap-1 justify-end">
              <Button size="icon" variant="ghost" asChild>
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={15} />
                </a>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => router.push(`/dashboard/links/${link.id}`)}>
                <BarChart2 size={15} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setEditingLink(link)}>
                <Pencil size={15} />
              </Button>
              <Button
                size="icon" variant="ghost" disabled={isDeleting}
                onClick={() => handleDelete(link.id)}
                className={confirmDeleteId === link.id ? 'text-destructive hover:text-destructive' : ''}
              >
                <Trash2 size={15} />
              </Button>
              {confirmDeleteId === link.id && (
                <span className="text-xs text-destructive whitespace-nowrap">Click again to delete</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{totalElements} links</span>
          <div className="flex items-center gap-2">
            <Button
              size="icon" variant="outline" disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={15} />
            </Button>
            <span className="text-xs px-2">
              Trang {page + 1} / {totalPages}
            </span>
            <Button
              size="icon" variant="outline" disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}

      <CreateLinkModal open={modalOpen} onOpenChange={setModalOpen} />
      <EditLinkModal
        link={editingLink}
        open={!!editingLink}
        onOpenChange={(open) => { if (!open) setEditingLink(null) }}
      />
    </div>
  )
}
