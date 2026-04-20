'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Copy, ExternalLink, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'

interface Campaign {
  id: string
  name: string
  description: string
  createdAt: string
}

interface LinkItem {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  title: string
  platform: string
  campaignId: string
  tags: string[]
  createdAt: string
}

interface PageResponse {
  content: LinkItem[]
  totalElements: number
  totalPages: number
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    SHOPEE: 'bg-orange-500/20 text-orange-400',
    LAZADA: 'bg-blue-500/20 text-blue-400',
    TIKTOK: 'bg-pink-500/20 text-pink-400',
    FACEBOOK: 'bg-blue-600/20 text-blue-300',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[platform] ?? 'bg-muted text-muted-foreground'}`}>
      {platform}
    </span>
  )
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { data: campaign, isLoading: loadingCampaign } = useQuery<Campaign>({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const res = await api.get(`/campaigns/${id}`)
      return res as unknown as Campaign
    },
  })

  const { data: linksPage, isLoading: loadingLinks } = useQuery<PageResponse>({
    queryKey: ['campaign-links', id],
    queryFn: async () => {
      const res = await api.get(`/campaigns/${id}/links?page=0&size=50`)
      return res as unknown as PageResponse
    },
  })

  const links = linksPage?.content ?? []

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl)
    toast.success('Copied!')
  }

  if (loadingCampaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/campaigns')}
          className="text-muted-foreground hover:text-foreground transition"
        >
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">{campaign?.name ?? 'Campaign'}</h1>
          {campaign?.description && (
            <p className="text-sm text-muted-foreground">{campaign.description}</p>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl px-6 py-4">
        <p className="text-3xl font-bold">{linksPage?.totalElements ?? 0}</p>
        <p className="text-sm text-muted-foreground">Total links</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold">Links in this campaign</h2>
        </div>

        {loadingLinks && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}

        {!loadingLinks && links.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No links in this campaign yet.</p>
            <button
              onClick={() => router.push('/dashboard/links')}
              className="mt-3 text-primary hover:underline text-sm"
            >
              Go to Links to add
            </button>
          </div>
        )}

        {links.length > 0 && (
          <div>
            <div className="grid grid-cols-[1fr_160px_100px] gap-4 px-4 py-2 bg-muted/50 text-xs text-muted-foreground font-medium">
              <span>LINK</span>
              <span>SHORT URL</span>
              <span>ACTIONS</span>
            </div>
            {links.map((link) => (
              <div
                key={link.id}
                className="grid grid-cols-[1fr_160px_100px] gap-4 px-4 py-3 border-t border-border items-center hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {link.title ?? 'No title'}
                    </span>
                    <PlatformBadge platform={link.platform} />
                  </div>
                  <span className="text-xs text-muted-foreground truncate block">
                    {link.originalUrl}
                  </span>
                </div>

                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs text-blue-400 truncate">{link.shortCode}</span>
                  <button
                    onClick={() => handleCopy(link.shortUrl)}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <Copy size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <button
                    onClick={() => router.push(`/dashboard/links/${link.id}`)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
                  >
                    <BarChart2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
