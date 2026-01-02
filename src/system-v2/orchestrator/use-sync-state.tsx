import React, { createContext, useContext } from 'react'
import type { SyncState } from '../state-machine/states'

type SyncStateContextValue = {
  state: SyncState
  signOut: () => void
}

const SyncStateContext = createContext<SyncStateContextValue | null>(null)

export function SyncStateProvider({
  state,
  signOut,
  children
}: {
  state: SyncState
  signOut: () => void
  children: React.ReactNode
}) {
  return (
    <SyncStateContext.Provider value={{ state, signOut }}>
      {children}
    </SyncStateContext.Provider>
  )
}

export function useSyncState(): SyncState {
  const context = useContext(SyncStateContext)
  if (!context) {
    throw new Error('useSyncState must be used within SyncOrchestrator')
  }
  return context.state
}

export function useSignOut(): () => void {
  const context = useContext(SyncStateContext)
  if (!context) {
    throw new Error('useSignOut must be used within SyncOrchestrator')
  }
  return context.signOut
}
