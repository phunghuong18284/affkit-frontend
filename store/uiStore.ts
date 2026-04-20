// =============================================================================
// store/uiStore.ts
// =============================================================================

import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  isCreateLinkModalOpen: boolean

  toggleSidebar: () => void
  openCreateLinkModal: () => void
  closeCreateLinkModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isCreateLinkModalOpen: false,

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  openCreateLinkModal: () => set({ isCreateLinkModalOpen: true }),
  closeCreateLinkModal: () => set({ isCreateLinkModalOpen: false }),
}))
