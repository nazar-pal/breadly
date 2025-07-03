import { create } from 'zustand'

type SidebarState = {
  isOpen: boolean
}

type SidebarActions = {
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

type SidebarStore = SidebarState & {
  actions: SidebarActions
}

export const sidebarStore = create<SidebarStore>((set, get) => ({
  // State
  isOpen: false,

  // Actions
  actions: {
    openSidebar: () => set({ isOpen: true }),
    closeSidebar: () => set({ isOpen: false }),
    toggleSidebar: () => set(state => ({ isOpen: !state.isOpen }))
  }
}))

// Hooks
export const useSidebarState = () => sidebarStore(state => state.isOpen)

export const useTabsHeaderActions = () => sidebarStore(state => state.actions)
