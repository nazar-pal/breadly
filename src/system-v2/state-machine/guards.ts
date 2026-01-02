import type { SyncState } from './states'

/**
 * Guard functions check if a transition is allowed given current state and event
 */

export function canEnableSync(state: SyncState, isPremium: boolean): boolean {
  if (!isPremium) return false

  return ['local_only', 'migrating_guest_to_auth'].includes(state.status)
}

export function shouldDrainQueueBeforeDisable(
  state: SyncState,
  hasUploadQueue: boolean
): boolean {
  return state.status === 'synced' && hasUploadQueue
}
