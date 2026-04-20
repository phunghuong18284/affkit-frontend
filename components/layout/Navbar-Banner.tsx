'use client'

import { usePathname } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/links': 'Links',
  '/campaigns': 'Campaigns',
  '/analytics': 'Analytics',
  '/settings': 'Cài đặt',
}

export function Navbar() {
  const pathname = usePathname()

  const title = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname === key || pathname.startsWith(key + '/')
  )?.[1] ?? 'AffKit'

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <Button size="sm" className="gap-2">
        <Plus size={16} />
        <span>Tạo link</span>
      </Button>
    </header>
  )
}