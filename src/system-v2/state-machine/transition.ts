import type { SyncState } from './states'
import type { SyncEvent } from './events'
import { canEnableSync, shouldDrainQueueBeforeDisable } from './guards'

/**
 * Pure state transition function
 *
 * Given a current state and an event, returns the next state.
 * This function has no side effects and is fully testable.
 */
export function transition(state: SyncState, event: SyncEvent): SyncState {
  switch (state.status) {
    case 'uninitialized':
      if (event.type === 'APP_START') {
        return { status: 'initializing' }
      }
      return state

    case 'initializing':
      if (event.type === 'INIT_COMPLETE') {
        const { userId, isGuest, isPremium, hasGuestData, needsSeed } = event

        if (isGuest && needsSeed) {
          return { status: 'seeding_guest', userId }
        }

        if (isGuest && !needsSeed) {
          return { status: 'local_only', userId, isGuest: true }
        }

        if (!isGuest && hasGuestData && event.guestId) {
          // Need to migrate guest data first
          return {
            status: 'migrating_guest_to_auth',
            guestId: event.guestId,
            authId: userId
          }
        }

        if (!isGuest && isPremium) {
          return { status: 'switching_to_sync', userId }
        }

        if (!isGuest && !isPremium) {
          return { status: 'local_only', userId, isGuest: false }
        }
      }
      return state

    case 'seeding_guest':
      if (event.type === 'SEEDING_COMPLETE') {
        // Check if user authenticated during seeding
        if (state.pendingAuth) {
          return {
            status: 'migrating_guest_to_auth',
            guestId: state.pendingAuth.guestId,
            authId: state.pendingAuth.authId
          }
        }
        return {
          status: 'local_only',
          userId: state.userId,
          isGuest: true
        }
      }
      // Queue authentication for after seeding completes
      if (event.type === 'USER_AUTHENTICATED') {
        return {
          status: 'seeding_guest',
          userId: state.userId,
          pendingAuth: {
            authId: event.authId,
            guestId: event.guestId || state.userId
          }
        }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'local_only':
      if (event.type === 'USER_AUTHENTICATED') {
        return {
          status: 'migrating_guest_to_auth',
          guestId: event.guestId || state.userId,
          authId: event.authId
        }
      }
      if (
        event.type === 'SUBSCRIPTION_ACTIVATED' &&
        canEnableSync(state, true)
      ) {
        return { status: 'switching_to_sync', userId: state.userId }
      }
      if (event.type === 'USER_SIGNED_OUT') {
        return { status: 'signing_out', userId: state.userId }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'migrating_guest_to_auth':
      if (event.type === 'MIGRATION_COMPLETE') {
        if (event.isPremium) {
          return { status: 'switching_to_sync', userId: state.authId }
        } else {
          return {
            status: 'local_only',
            userId: state.authId,
            isGuest: false
          }
        }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'switching_to_sync':
      if (event.type === 'SCHEMA_SWITCH_COMPLETE') {
        return { status: 'synced', userId: state.userId }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'synced':
      if (event.type === 'SUBSCRIPTION_EXPIRED') {
        if (shouldDrainQueueBeforeDisable(state, event.hasUploadQueue)) {
          return {
            status: 'draining_upload_queue',
            userId: state.userId,
            startedAt: Date.now()
          }
        } else {
          return { status: 'switching_to_local', userId: state.userId }
        }
      }
      if (event.type === 'USER_SIGNED_OUT') {
        return { status: 'signing_out', userId: state.userId }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'draining_upload_queue':
      if (event.type === 'QUEUE_DRAINED') {
        return { status: 'switching_to_local', userId: state.userId }
      }
      if (event.type === 'QUEUE_DRAIN_TIMEOUT') {
        // Warn user but proceed to local mode
        return { status: 'switching_to_local', userId: state.userId }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'switching_to_local':
      if (event.type === 'SCHEMA_SWITCH_COMPLETE') {
        return {
          status: 'local_only',
          userId: state.userId,
          isGuest: false
        }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'signing_out':
      if (event.type === 'SIGN_OUT_COMPLETE') {
        return { status: 'uninitialized' }
      }
      if (event.type === 'ERROR') {
        return { status: 'error', error: event.error, previousState: state }
      }
      return state

    case 'error':
      if (event.type === 'RETRY') {
        return state.previousState
      }
      return state

    default:
      return state
  }
}
