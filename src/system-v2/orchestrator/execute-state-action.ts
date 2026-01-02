import { Alert } from 'react-native'
import {
  checkDbForGuestData,
  drainUploadQueue,
  initializePowerSync,
  migrateGuestToAuth,
  performSignOut,
  seedGuestData,
  switchToLocalSchema,
  switchToSyncedSchema
} from '../actions'
import { Connector } from '../powersync/connector'
import { powersync } from '../powersync/database'
import type { SyncEvent } from '../state-machine/events'
import type { SyncState } from '../state-machine/states'

// Re-export for use in sync-orchestrator
export { checkDbForGuestData }

/**
 * Check if guest user needs seeding (inverse of checkDbForGuestData)
 * Returns true if user has no data (needs seeding)
 */
async function checkNeedsSeed(userId: string): Promise<boolean> {
  const hasData = await checkDbForGuestData(userId)
  return !hasData
}

const connector = new Connector()

/**
 * Execute side effects based on current state
 * Returns an event to drive the next state transition, or null for states that don't need actions.
 * The orchestrator should skip calling this for no-op states.
 */
export async function executeStateAction(
  state: SyncState,
  signal?: AbortSignal
): Promise<SyncEvent | null> {
  if (signal?.aborted) {
    return { type: 'ERROR', error: new Error('Action aborted') }
  }

  try {
    switch (state.status) {
      // No-op states: return null, orchestrator handles these externally
      case 'uninitialized':
      case 'initializing':
      case 'synced':
      case 'local_only':
      case 'error':
        return null

      case 'seeding_guest':
        return await seedGuestData(state.userId)

      case 'migrating_guest_to_auth':
        // guestId is now properly passed through the state from INIT_COMPLETE event
        if (!state.guestId) {
          return {
            type: 'ERROR',
            error: new Error('Guest ID not found for migration')
          }
        }

        const migrationResult = await migrateGuestToAuth(
          state.guestId,
          state.authId
        )
        // Note: isPremium will be updated by orchestrator after this event
        return migrationResult

      case 'switching_to_sync':
        await switchToSyncedSchema(powersync, state.userId)
        // Connect PowerSync (errors handled separately in todo #8)
        try {
          await powersync.connect(connector)
        } catch (connectError) {
          // Log but don't fail - PowerSync will auto-retry connection
          console.warn(
            '[executeStateAction] PowerSync connect failed, will auto-retry:',
            connectError
          )
        }
        return { type: 'SCHEMA_SWITCH_COMPLETE' }

      case 'draining_upload_queue':
        return await drainUploadQueue(powersync, {
          timeoutMs: 30000,
          signal,
          onProgress: count => {
            if (__DEV__) {
              console.log(`[drainUploadQueue] ${count} items remaining`)
            }
          },
          onTimeout: () => {
            Alert.alert(
              'Sync Incomplete',
              'Some changes may not have been saved to the cloud. They will be stored locally.',
              [{ text: 'OK' }]
            )
          }
        })

      case 'switching_to_local':
        await switchToLocalSchema(powersync, { userId: state.userId })
        return { type: 'SCHEMA_SWITCH_COMPLETE' }

      case 'signing_out':
        return await performSignOut()

      default:
        return { type: 'ERROR', error: new Error('Unknown state') }
    }
  } catch (error) {
    console.error('[executeStateAction] Error:', error)
    return {
      type: 'ERROR',
      error: error instanceof Error ? error : new Error(String(error))
    }
  }
}

/**
 * Gather initialization context.
 *
 * Note: `hasGuestData` is checked separately by the orchestrator using
 * `checkDbForGuestData()` because it requires the persisted guestId which
 * is not available here.
 */
export async function gatherInitContext(params: {
  userId: string
  isGuest: boolean
}): Promise<{
  needsSeed: boolean
}> {
  // Initialize PowerSync database first
  await initializePowerSync()

  const { userId, isGuest } = params

  if (isGuest) {
    const needsSeed = await checkNeedsSeed(userId)
    return { needsSeed }
  }

  // For authenticated users, seeding is never needed
  return { needsSeed: false }
}
