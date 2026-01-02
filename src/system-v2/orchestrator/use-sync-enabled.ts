import { useSyncState } from './use-sync-state'

/**
 * Compatibility hook for checking if sync is enabled
 * Replaces useSessionPersistentStore().syncEnabled
 */
export function useSyncEnabled(): boolean {
  const state = useSyncState()
  return state.status === 'synced'
}
