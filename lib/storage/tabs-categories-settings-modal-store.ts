import { create } from 'zustand'

type TabsCategoriesSettingsModalState = {
  visible: boolean
}

type TabsCategoriesSettingsModalActions = {
  open: () => void
  close: () => void
}

type TabsCategoriesSettingsModalStore = TabsCategoriesSettingsModalState & {
  actions: TabsCategoriesSettingsModalActions
}

export const tabsCategoriesSettingsModalStore =
  create<TabsCategoriesSettingsModalStore>(set => ({
    // State
    visible: false,

    // Actions
    actions: {
      open: () => set({ visible: true }),
      close: () => set({ visible: false })
    }
  }))

// Hooks
export const useTabsCategoriesSettingsModalState = () =>
  tabsCategoriesSettingsModalStore(state => state)

export const useTabsCategoriesSettingsModalActions = () =>
  tabsCategoriesSettingsModalStore(state => state.actions)
