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

const useStore = create<UserSessionStore>(set => ({
  session: null,
  isMigrating: false,
  isInitializing: true,
  actions: {
    setSession: (session: UserSession) => set({ session }),
    setIsMigrating: (isMigrating: boolean) => set({ isMigrating }),
    setIsInitializing: (isInitializing: boolean) => set({ isInitializing })
  }
}))

export const useUserSession = () => {
  const session = useStore(state => state.session)
  if (!session) throw new Error('User session not found')

  return session
}

export const useUserSessionInitializingState = () => {
  return useStore(
    useShallow(state => ({
      session: state.session,
      isMigrating: state.isMigrating,
      isInitializing: state.isInitializing
    }))
  )
}
export const useActions = () => useStore(state => state.actions)
