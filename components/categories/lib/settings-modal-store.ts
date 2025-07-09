import { create } from 'zustand'

interface SettingsModalState {
  visible: boolean
}

interface SettingsModalActions {
  open: () => void
  close: () => void
}

type SettingsModalStore = SettingsModalState & SettingsModalActions

export const useSettingsModalStore = create<SettingsModalStore>(set => ({
  // Initial state
  visible: false,

  // Actions
  open: () => set({ visible: true }),
  close: () => set({ visible: false })
}))
