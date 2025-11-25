import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type AccountSettingsState = {
  showArchived: boolean
}

type AccountSettingsActions = {
  toggleShowArchived: () => void
  setShowArchived: (value: boolean) => void
}

type AccountSettingsStore = AccountSettingsState & {
  actions: AccountSettingsActions
}

const INITIAL_STATE: AccountSettingsState = {
  showArchived: false
}

const accountSettingsStore = create<AccountSettingsStore>(set => ({
  ...INITIAL_STATE,
  actions: {
    toggleShowArchived: () =>
      set(state => ({ showArchived: !state.showArchived })),
    setShowArchived: value => set({ showArchived: value })
  }
}))

export const useAccountSettingsState = () =>
  accountSettingsStore(
    useShallow(state => ({
      showArchived: state.showArchived
    }))
  )

export const useAccountSettingsActions = () =>
  accountSettingsStore(state => state.actions)
