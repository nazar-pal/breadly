import { LocalStore } from '@/lib/storage/mmkv'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Data = {
  guestId: string | null
  needToReplaceGuestWithAuthUserId: boolean
  needToSeedDefaultDataForGuestUser: boolean
  syncEnabled: boolean
}

type Actions = {
  setGuestId: (guestId: string) => void
  removeGuestId: () => void
  setNeedToReplaceGuestWithAuthUserId: (enabled: boolean) => void
  setNeedToSeedDefaultDataForGuestUser: (enabled: boolean) => void
  setSyncEnabled: (enabled: boolean) => void

  reset: () => void
}

type UserSessionPersistentStore = Data & Actions

const initialState: Data = {
  guestId: null,
  needToReplaceGuestWithAuthUserId: false,
  needToSeedDefaultDataForGuestUser: false,
  syncEnabled: false
}

export const sessionPersistentStore = create<UserSessionPersistentStore>()(
  persist(
    set => ({
      ...initialState,

      setGuestId: (guestId: string) => set(() => ({ guestId })),

      removeGuestId: () =>
        set(() => ({ guestId: null, needToReplaceGuestWithAuthUserId: false })),

      setNeedToReplaceGuestWithAuthUserId: (enabled: boolean) =>
        set(() => ({ needToReplaceGuestWithAuthUserId: enabled })),

      setNeedToSeedDefaultDataForGuestUser: (enabled: boolean) =>
        set(() => ({ needToSeedDefaultDataForGuestUser: enabled })),

      setSyncEnabled: (enabled: boolean) =>
        set(() => ({ syncEnabled: enabled })),

      reset: () => set(() => ({ ...initialState }))
    }),
    {
      name: 'guest-data-storage',
      storage: createJSONStorage(() => LocalStore),
      version: 1,
      // Only persist the state values
      partialize: state => ({
        guestId: state.guestId,
        needToReplaceGuestWithAuthUserId:
          state.needToReplaceGuestWithAuthUserId,
        needToSeedDefaultDataForGuestUser:
          state.needToSeedDefaultDataForGuestUser,
        syncEnabled: state.syncEnabled
      })
    }
  )
)

export const useSessionPersistentStore = sessionPersistentStore
