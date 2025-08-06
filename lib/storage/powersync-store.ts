import { db, powerSyncDb } from '@/data/client/powersync/system'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type PowerSyncState = {
  db: typeof db
  powerSyncDb: typeof powerSyncDb
  isConnected: boolean
  isConnecting: boolean
  isSyncing: boolean
  hasSynced: boolean
  lastSyncedAt: Date | null
  error: Error | null
}

type PowerSyncActions = {
  setIsConnecting: (isConnecting: boolean) => void
  setError: (error: Error | null) => void
  setIsConnected: (isConnected: boolean) => void
  setIsSyncing: (isSyncing: boolean) => void
  setHasSynced: (hasSynced: boolean) => void
  setLastSyncedAt: (lastSyncedAt: Date | null) => void
}

type PowerSyncStore = PowerSyncState & {
  actions: PowerSyncActions
}

export const powerSyncStore = create<PowerSyncStore>((set, get) => ({
  // State
  db,
  powerSyncDb,
  isConnected: false,
  isConnecting: false,
  isSyncing: false,
  hasSynced: false,
  lastSyncedAt: null,
  error: null,

  // Actions
  actions: {
    setIsConnecting: (isConnecting: boolean) => set({ isConnecting }),
    setIsConnected: (isConnected: boolean) => set({ isConnected }),

    setIsSyncing: (isSyncing: boolean) => set({ isSyncing }),
    setHasSynced: (hasSynced: boolean) => set({ hasSynced }),
    setLastSyncedAt: (lastSyncedAt: Date | null) => set({ lastSyncedAt }),

    setError: (error: Error | null) => set({ error })
  }
}))

// Hooks
export const usePowerSyncStore = powerSyncStore

export const usePowerSyncState = () => {
  return powerSyncStore(
    useShallow(state => ({
      db: state.db,
      powerSyncDb: state.powerSyncDb,
      isConnected: state.isConnected,
      isConnecting: state.isConnecting,
      isSyncing: state.isSyncing,
      hasSynced: state.hasSynced,
      lastSyncedAt: state.lastSyncedAt,
      error: state.error
    }))
  )
}

export const usePowerSyncActions = () => powerSyncStore(state => state.actions)

// Convenience hook for connection state
export const usePowerSyncConnectionState = () => {
  return powerSyncStore(
    useShallow(state => ({
      isConnected: state.isConnected,
      isConnecting: state.isConnecting,
      error: state.error
    }))
  )
}
