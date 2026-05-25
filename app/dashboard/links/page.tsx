'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, ExternalLink, Search, Pencil, BarChart2, ChevronLeft, ChevronRight, Zap, Link2, QrCode, Download, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { CreateLinkModal } from '@/components/links/CreateLinkModal'
import { EditLinkModal } from '@/components/links/EditLinkModal'
import { PlanLimitBanner } from '@/components/layout/PlanLimitBanner'
import { useLinks, useDeleteLink, useCreateLink, type LinkResponse } from '@/hooks/useLinks'
import { useConvertLink } from '@/hooks/useConvertLink'
import api from '@/lib/api'

const PAGE_SIZE = 10

type BulkResult = {
  originalUrl: string
  affiliateUrl: string
  status: 'success' | 'unsupported' | 'error'
}

function PlatformBadge({ platform }: { platform: string | null }) {
  if (!platform) return null
  const colors: Record<string, string> = {
    SHOPEE:      'bg-orange-500/20 text-orange-400',
    LAZADA:      'bg-blue-500/20 text-blue-400',
    TIKTOK:      'bg-pink-500/20 text-pink-400',
    FACEBOOK:    'bg-blue-600/20 text-blue-300',
    TIKI:        'bg-blue-400/20 text-blue-300',
    NGUYEN_KIM:  'bg-yellow-500/20 text-yellow-400',
    'NGUYEN KIM': 'bg-yellow-500/20 text-yellow-400',
    VASCARA:     'bg-purple-500/20 text-purple-400',
    JUNO:        'bg-rose-500/20 text-rose-400',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[platform] ?? 'bg-muted text-muted-foreground'}`}>
      {platform.toUpperCase()}
    </span>
  )
}

function detectPlatform(url: string): string {
  if (url.includes('shopee.vn')) return 'SHOPEE'
  if (url.includes('lazada.vn')) return 'LAZADA'
  if (url.includes('tiki.vn')) return 'TIKI'
  if (url.includes('tiktok.com')) return 'TIKTOK'
  if (url.includes('nguyenkim.com')) return 'NGUYEN_KIM'
  if (url.includes('vascara.com')) return 'VASCARA'
  if (url.includes('juno.vn')) return 'JUNO'
  return 'OTHER'
}

function getDisplayShortUrl(shortUrl: string, platform: string | null): string {
  const code = shortUrl?.split('/').pop() ?? ''
  const subdomainMap: Record<string, string> = {
    SHOPEE:     'shopee',
    LAZADA:     'lazada',
    TIKI:       'tiki',
    TIKTOK:     'tiktok',
    NGUYEN_KIM: 'nguyenkim',
    'NGUYEN KIM': 'nguyenkim',
    VASCARA:    'vascara',
    JUNO:       'juno',
  }
  const subdomain = subdomainMap[platform ?? ''] ?? 'go'
  return `https://${subdomain}.affkit.vn/${code}`
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
  const [qrLink, setQrLink] = useState<LinkResponse | null>(null)

  const [bulkUrls, setBulkUrls] = useState('')
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([])
  const [isBulkConverting, setIsBulkConverting] = useState(false)
  const [showBulk, setShowBulk] = useState(false)

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
    toast.success('Đã copy!')
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

  const handleExportCSV = () => {
    if (links.length === 0) {
      toast.error('Không có link nào để xuất')
      return
    }
    const headers = ['Title', 'Original URL', 'Short URL', 'Affiliate URL', 'Platform', 'Clicks']
    const rows = links.map(l => [
      l.title ?? '',
      l.originalUrl ?? '',
      getDisplayShortUrl(l.shortUrl, l.platform),
      l.affiliateUrl ?? '',
      l.platform ?? '',
      String(l.totalClicks ?? 0),
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${v.replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `affkit-links-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã xuất CSV!')
  }

  const handleBulkConvert = async () => {
    const urls = bulkUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.startsWith('http://') || u.startsWith('https://'))

    if (urls.length === 0) {
      toast.error('Vui lòng nhập ít nhất 1 link hợp lệ')
      return
    }

    setIsBulkConverting(true)
    setBulkResults([])
    try {
      const res = await api.post('/links/bulk-convert', { urls }) as any
      const results: BulkResult[] = Array.isArray(res) ? res : res.data ?? res
      setBulkResults(results)

      const successResults = results.filter(r => r.status === 'success')
      let saved = 0
      for (const r of successResults) {
        try {
          await createLink({
            originalUrl: r.originalUrl,
            title: detectPlatform(r.originalUrl) + ' link',
            affiliateUrl: r.affiliateUrl,
          })
          saved++
        } catch {
          // bo qua neu loi
        }
      }
      if (saved > 0) toast.success(`Đã lưu ${saved} link vào danh sách!`)
    } catch {
      toast.error('Convert hàng loạt thất bại')
    } finally {
      setIsBulkConverting(false)
    }
  }

const handleCopyAllBulk = () => {
  const successLinks = bulkResults
    .filter(r => r.status === 'success')
    .map(r => r.shortUrl ?? r.affiliateUrl)
    .join('\n')
  if (!successLinks) {
    toast.error('Không có link nào thành công')
    return
  }
  navigator.clipboard.writeText(successLinks)
  toast.success('Đã copy tất cả affiliate links!')
}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Links</h2>
          <p className="text-sm text-muted-foreground">Quản lý link rút gọn của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download size={16} />
            Xuất CSV
          </Button>
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Tạo link mới
          </Button>
        </div>
      </div>

      <PlanLimitBanner />

      <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-foreground">Convert sang Affiliate Link</span>
            <span className="text-xs text-muted-foreground">(Tiki, Lazada, TikTok)</span>
          </div>
          <Button
            size="sm"
            variant={showBulk ? 'default' : 'outline'}
            className="gap-1 text-xs"
            onClick={() => { setShowBulk(!showBulk); setBulkResults([]) }}
          >
            <Layers size={13} />
            Convert hàng loạt
          </Button>
        </div>

        {!showBulk ? (
          <>
            {!convertResult ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Dán link Tiki / Lazada / TikTok vào đây..."
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
                  {isConverting ? <span className="animate-spin">&#x27F3;</span> : <Link2 size={15} />}
                  {isConverting ? 'Đang convert...' : 'Convert'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border border-border">
                  <PlatformBadge platform={convertResult.platform} />
                  <span className="text-sm text-blue-400 flex-1 truncate">{convertResult.affiliateUrl}</span>
                  <Button size="sm" variant="outline" onClick={() => handleCopy(convertResult.affiliateUrl)} className="shrink-0 gap-1">
                    <Copy size={13} />
                    Copy
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate max-w-[60%]">
                    Từ: {convertResult.originalUrl}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveAsNewLink} disabled={isCreating || linkSaved} className="gap-1 shrink-0">
                      {linkSaved ? 'Đã lưu!' : isCreating ? 'Đang lưu...' : 'Lưu vào danh sách'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleConvertReset} className="text-xs h-7">
                      Convert link khác
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {convertError && <p className="text-xs text-destructive">{convertError}</p>}
          </>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Dán nhiều link vào đây, mỗi dòng 1 link..."
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleBulkConvert}
                disabled={isBulkConverting || !bulkUrls.trim()}
                className="gap-2"
              >
                {isBulkConverting ? <span className="animate-spin">&#x27F3;</span> : <Layers size={15} />}
                {isBulkConverting ? 'Đang convert và lưu...' : 'Convert hàng loạt'}
              </Button>
              {bulkResults.length > 0 && (
                <Button size="sm" variant="outline" onClick={handleCopyAllBulk} className="gap-1">
                  <Copy size={13} />
                  Copy tất cả
                </Button>
              )}
            </div>

            {bulkResults.length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  {bulkResults.filter(r => r.status === 'success').length}/{bulkResults.length} link thành công
                </p>
                {bulkResults.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-background border border-border">
                    <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                    {r.status === 'success' ? (
                      <>
                        <PlatformBadge platform={detectPlatform(r.originalUrl)} />
                        <span className="text-xs text-green-400 flex-1 truncate">{r.shortUrl ?? r.affiliateUrl}</span>
                        <button onClick={() => handleCopy(r.shortUrl ?? r.affiliateUrl)} className="shrink-0 text-muted-foreground hover:text-foreground">
                          <Copy size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-destructive flex-1 truncate">
                        {r.status === 'unsupported' ? '[Sàn chưa hỗ trợ]' : '[Lỗi]'} {r.originalUrl}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm link..."
          className="pl-9"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_220px_80px_180px] gap-4 px-4 py-2 bg-muted/50 text-xs text-muted-foreground font-medium">
          <span>LINK</span>
          <span>LINK RÚT GỌN</span>
          <span>LƯỢT CLICK</span>
          <span></span>
        </div>

        {isLoading && <><LinkRowSkeleton /><LinkRowSkeleton /><LinkRowSkeleton /></>}

        {isError && (
          <div className="text-center py-12 text-sm text-destructive">
            Không thể tải danh sách link. Vui lòng thử lại.
          </div>
        )}

        {!isLoading && !isError && links.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Chưa có link nào.</p>
            <p className="text-muted-foreground text-xs mt-1">Nhan "+ Tạo link mới" de bat dau</p>
          </div>
        )}

        {links.map((link) => {
          const displayUrl = getDisplayShortUrl(link.shortUrl, link.platform)
          return (
            <div
              key={link.id}
              className="grid grid-cols-[1fr_220px_80px_180px] gap-4 px-4 py-3 border-t border-border items-center hover:bg-muted/30 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {link.title ?? 'Chưa có tiêu đề'}
                  </span>
                  <PlatformBadge platform={link.platform} />
                </div>
                <span className="text-xs text-muted-foreground truncate block">{link.originalUrl}</span>
              </div>

              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs text-blue-400 truncate">{displayUrl}</span>
                <button onClick={() => handleCopy(displayUrl)} className="shrink-0 text-muted-foreground hover:text-foreground">
                  <Copy size={13} />
                </button>
              </div>

              <span className="text-sm text-foreground">{link.totalClicks ?? 0}</span>

              <div className="flex items-center gap-1 justify-end">
                <Button size="icon" variant="ghost" asChild>
                  <a href={displayUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={15} />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setQrLink(link)}>
                  <QrCode size={15} />
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
                  <span className="text-xs text-destructive whitespace-nowrap">Nhấn lần nữa để xóa</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{totalElements} links</span>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={15} />
            </Button>
            <span className="text-xs px-2">Trang {page + 1} / {totalPages}</span>
            <Button size="icon" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {qrLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setQrLink(null)}
        >
          <div
            className="bg-background border border-border rounded-lg p-6 flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium">QR Code</p>
            <QRCodeSVG value={getDisplayShortUrl(qrLink.shortUrl, qrLink.platform)} size={200} />
            <p className="text-xs text-muted-foreground">{getDisplayShortUrl(qrLink.shortUrl, qrLink.platform)}</p>
            <Button size="sm" variant="outline" className="w-full" onClick={() => handleCopy(getDisplayShortUrl(qrLink.shortUrl, qrLink.platform))}>
              <Copy size={12} className="mr-1" />
              Copy link
            </Button>
            <Button size="sm" variant="ghost" className="w-full" onClick={() => setQrLink(null)}>
              Đóng
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
