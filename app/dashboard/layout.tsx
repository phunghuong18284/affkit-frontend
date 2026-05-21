'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { PlanLimitBanner } from '@/components/layout/PlanLimitBanner'
import { ProExpiryBanner } from '@/components/layout/ProExpiryBanner'
import { CreateLinkModal } from '@/components/links/CreateLinkModal'
import { useUIStore } from '@/store/uiStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { accessToken, _hasHydrated } = useAuthStore()
  const { isCreateLinkModalOpen, closeCreateLinkModal } = useUIStore()

  useEffect(() => {
    if (_hasHydrated && !accessToken) {
      router.replace('/login')
    }
  }, [accessToken, _hasHydrated])

  if (!_hasHydrated) return null
  if (!accessToken) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <PlanLimitBanner />
          <ProExpiryBanner />
          {children}
        </main>
      </div>
      <CreateLinkModal
        open={isCreateLinkModalOpen}
        onOpenChange={(open) => !open && closeCreateLinkModal()}
      />
    </div>
  )
}