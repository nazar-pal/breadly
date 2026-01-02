import type { SyncState } from './states'

/**
 * SyncEvent - All possible events that can trigger state transitions
 *
 * Events are derived from external conditions (user auth, subscription status, etc.)
 * and drive the state machine forward.
 */
export type SyncEvent =
  | { type: 'APP_START' }
  | {
      type: 'INIT_COMPLETE'
      userId: string
      isGuest: boolean
      isPremium: boolean
      hasGuestData: boolean
      needsSeed: boolean
      /** Guest ID for migration (only when hasGuestData is true) */
      guestId?: string
    }
  | { type: 'SEEDING_COMPLETE' }
  | { type: 'USER_AUTHENTICATED'; authId: string; guestId?: string }
  | { type: 'MIGRATION_COMPLETE'; isPremium: boolean }
  | { type: 'SUBSCRIPTION_ACTIVATED' }
  | { type: 'SUBSCRIPTION_EXPIRED'; hasUploadQueue: boolean }
  | { type: 'QUEUE_DRAINED' }
  | { type: 'QUEUE_DRAIN_TIMEOUT' }
  | { type: 'SCHEMA_SWITCH_COMPLETE' }
  | { type: 'USER_SIGNED_OUT' }
  | { type: 'SIGN_OUT_COMPLETE'; newGuestId: string }
  | { type: 'ERROR'; error: Error }
  | { type: 'RETRY' }

/**
 * Derive an event from external conditions
 * This is called when external state changes (auth, purchases, etc.)
 */
export function deriveEvent(
  currentState: SyncState,
  conditions: {
    userId: string | null
    isGuest: boolean
    isPremium: boolean
    isPurchaseStatusVerified: boolean
    hasGuestData: boolean
    needsSeed: boolean
    hasUploadQueue: boolean
  }
): SyncEvent | null {
  // Only process events when purchase status is verified (network verified)
  if (
    !conditions.isPurchaseStatusVerified &&
    currentState.status !== 'uninitialized'
  ) {
    return null
  }

  switch (currentState.status) {
    case 'uninitialized':
      return { type: 'APP_START' }

    case 'initializing':
      if (conditions.userId) {
        return {
          type: 'INIT_COMPLETE',
          userId: conditions.userId,
          isGuest: conditions.isGuest,
          isPremium: conditions.isPremium,
          hasGuestData: conditions.hasGuestData,
          needsSeed: conditions.needsSeed
        }
      }
      return null

    case 'local_only':
      // User authenticated while in guest mode
      if (!conditions.isGuest && currentState.isGuest && conditions.userId) {
        return {
          type: 'USER_AUTHENTICATED',
          authId: conditions.userId,
          guestId: currentState.userId
        }
      }
      // Subscription activated
      if (conditions.isPremium && !currentState.isGuest) {
        return { type: 'SUBSCRIPTION_ACTIVATED' }
      }
      return null

    case 'synced':
      // Subscription expired
      if (!conditions.isPremium) {
        return {
          type: 'SUBSCRIPTION_EXPIRED',
          hasUploadQueue: conditions.hasUploadQueue
        }
      }
      // User signed out
      if (conditions.isGuest) {
        return { type: 'USER_SIGNED_OUT' }
      }
      return null

    case 'draining_upload_queue':
      // Queue drained (checked externally)
      if (!conditions.hasUploadQueue) {
        return { type: 'QUEUE_DRAINED' }
      }
      // Timeout check (handled in action)
      return null

    case 'error':
      // Allow retry from error state
      return null

    default:
      return null
  }
}
