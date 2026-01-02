import { storage } from '@/lib/storage/mmkv'
import { SYNC_STATE_KEY } from '../const/storage-keys'
import type { SyncState } from '../state-machine/states'

/** How long an error state can persist before being auto-cleared (1 hour) */
const ERROR_STATE_MAX_AGE_MS = 60 * 60 * 1000

/** Wrapper type that includes timestamp for stale detection */
type PersistedStateWrapper = {
  state: SyncState
  savedAt: number
}

/**
 * Persist sync state for crash recovery
 */
export const persistedSyncState = {
  save(state: SyncState): void {
    try {
      const wrapper: PersistedStateWrapper = {
        state,
        savedAt: Date.now()
      }

      const serialized = JSON.stringify(wrapper, (key, value) => {
        // Handle Error objects
        if (value instanceof Error) {
          return {
            __error: true,
            message: value.message,
            name: value.name,
            stack: value.stack
          }
        }
        return value
      })
      storage.set(SYNC_STATE_KEY, serialized)
    } catch (error) {
      console.error('[persistedSyncState] Failed to save state:', error)
    }
  },

  load(): SyncState | null {
    try {
      const serialized = storage.getString(SYNC_STATE_KEY)
      if (!serialized) return null

      const parsed = JSON.parse(serialized, (key, value) => {
        // Restore Error objects
        if (value && typeof value === 'object' && value.__error) {
          const error = new Error(value.message)
          error.name = value.name
          error.stack = value.stack
          return error
        }
        return value
      })

      // Handle both old format (direct state) and new format (wrapper)
      let state: SyncState
      let savedAt: number | undefined

      if (
        parsed &&
        typeof parsed === 'object' &&
        'state' in parsed &&
        'savedAt' in parsed
      ) {
        // New wrapper format
        const wrapper = parsed as PersistedStateWrapper
        state = wrapper.state
        savedAt = wrapper.savedAt
      } else {
        // Old format (direct state) - treat as very old
        state = parsed as SyncState
        savedAt = 0
      }

      // Auto-clear stale error states to prevent users being stuck on error screen
      if (state.status === 'error' && savedAt !== undefined) {
        const age = Date.now() - savedAt
        if (age > ERROR_STATE_MAX_AGE_MS) {
          if (__DEV__) {
            console.log(
              `[persistedSyncState] Clearing stale error state (age: ${Math.round(age / 1000 / 60)} minutes)`
            )
          }
          this.clear()
          return null
        }
      }

      return state
    } catch (error) {
      console.error('[persistedSyncState] Failed to load state:', error)
      return null
    }
  },

  clear(): void {
    storage.remove(SYNC_STATE_KEY)
  }
}
