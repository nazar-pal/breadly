import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

export type UserSession = {
  userId: string
  isGuest: boolean
}

type UserSessionStore = {
  session: UserSession | null
  isMigrating: boolean
  isInitializing: boolean
  actions: {
    setSession: (session: UserSession) => void
    setIsMigrating: (isMigrating: boolean) => void
    setIsInitializing: (isInitializing: boolean) => void
  }
}

export const userSessionStore = create<UserSessionStore>(set => ({
  session: null,
  isMigrating: false,
  isInitializing: true,
  actions: {
    setSession: (session: UserSession) => set({ session }),
    setIsMigrating: (isMigrating: boolean) => set({ isMigrating }),
    setIsInitializing: (isInitializing: boolean) => set({ isInitializing })
  }
}))

export const useUserSessionStore = userSessionStore

export const useUserSessionInitializingState = () => {
  return useUserSessionStore(
    useShallow(state => ({
      session: state.session,
      isMigrating: state.isMigrating,
      isInitializing: state.isInitializing
    }))
  )
}

export const useUserSessionActions = () =>
  useUserSessionStore(state => state.actions)
