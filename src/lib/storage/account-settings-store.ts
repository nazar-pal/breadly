import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type AccountSettingsState = {
  visible: boolean
  showArchived: boolean
}

type AccountSettingsActions = {
  open: () => void
  close: () => void
  toggleShowArchived: () => void
  setShowArchived: (value: boolean) => void
}

type AccountSettingsStore = AccountSettingsState & {
  actions: AccountSettingsActions
}

const INITIAL_STATE: AccountSettingsState = {
  visible: false,
  showArchived: false
}

const accountSettingsStore = create<AccountSettingsStore>(set => ({
  ...INITIAL_STATE,
  actions: {
    open: () => set({ visible: true }),
    close: () => set({ visible: false }),
    toggleShowArchived: () =>
      set(state => ({ showArchived: !state.showArchived })),
    setShowArchived: value => set({ showArchived: value })
  }
}))

export const useAccountSettingsState = () =>
  accountSettingsStore(
    useShallow(state => ({
      visible: state.visible,
      showArchived: state.showArchived
    }))
  )

export const useAccountSettingsActions = () =>
  accountSettingsStore(state => state.actions)
