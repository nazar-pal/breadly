/**
 * SyncState - Single source of truth for sync orchestration state
 *
 * This type represents all possible states in the sync state machine.
 * Each state variant includes only the data needed for that specific state.
 */
/**
 * Pending authentication credentials when user authenticates during seeding
 */
export type PendingAuth = {
  authId: string
  guestId: string
}

export type SyncState =
  | { status: 'uninitialized' }
  | { status: 'initializing' }
  | { status: 'seeding_guest'; userId: string; pendingAuth?: PendingAuth }
  | { status: 'local_only'; userId: string; isGuest: boolean }
  | { status: 'migrating_guest_to_auth'; guestId: string; authId: string }
  | { status: 'switching_to_sync'; userId: string }
  | { status: 'synced'; userId: string }
  | { status: 'draining_upload_queue'; userId: string; startedAt: number }
  | { status: 'switching_to_local'; userId: string }
  | { status: 'signing_out'; userId: string }
  | { status: 'error'; error: Error; previousState: SyncState }

/**
 * Type guard to check if a state is a loading state (shows loading UI)
 */
export function isLoadingState(state: SyncState): boolean {
  return [
    'uninitialized',
    'initializing',
    'seeding_guest',
    'migrating_guest_to_auth',
    'switching_to_sync',
    'switching_to_local',
    'draining_upload_queue',
    'signing_out'
  ].includes(state.status)
}

/**
 * Type guard to check if a state is an error state
 */
export function isErrorState(
  state: SyncState
): state is Extract<SyncState, { status: 'error' }> {
  return state.status === 'error'
}

/**
 * Get user ID from any state that has one
 */
export function getUserId(state: SyncState): string | null {
  if ('userId' in state) return state.userId
  if ('authId' in state) return state.authId
  return null
}
