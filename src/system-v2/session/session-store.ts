import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

export type UserSession = {
  userId: string
  isGuest: boolean
}

type SessionStore = {
  session: UserSession | null
  actions: {
    setSession: (session: UserSession) => void
    clearSession: () => void
  }
}

export const sessionStore = create<SessionStore>(set => ({
  session: null,
  actions: {
    setSession: (session: UserSession) => set({ session }),
    clearSession: () => set({ session: null })
  }
}))

export const useSessionStore = sessionStore

export const useSession = () => {
  return useSessionStore(
    useShallow(state => ({
      session: state.session,
      ...state.actions
    }))
  )
}
