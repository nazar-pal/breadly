import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import type { SyncEvent } from '../state-machine/events'

const DEFAULT_TIMEOUT_MS = 30000 // 30 seconds

/**
 * Get the accurate count of pending operations in the upload queue
 * by querying the internal ps_crud table.
 */
async function getUploadQueueCount(
  powersync: AbstractPowerSyncDatabase
): Promise<number> {
  try {
    const result = await powersync.execute(
      'SELECT COUNT(*) as count FROM ps_crud'
    )
    return result.rows?._array?.[0]?.count ?? 0
  } catch {
    // Fallback: if ps_crud query fails, check if there's any transaction
    const transaction = await powersync.getNextCrudTransaction()
    return transaction ? transaction.crud.length : 0
  }
}

/**
 * Drains the PowerSync upload queue before switching to local-only mode.
 *
 * This ensures that any pending changes are synced to the server before
 * the user loses sync capability (e.g., subscription expiry).
 *
 * @param powersync - PowerSync database instance
 * @param options - Configuration options
 * @returns Event indicating success or timeout
 */
export async function drainUploadQueue(
  powersync: AbstractPowerSyncDatabase,
  options: {
    timeoutMs?: number
    signal?: AbortSignal
    onProgress?: (remaining: number) => void
    onTimeout?: () => void
  } = {}
): Promise<SyncEvent> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
    onProgress,
    onTimeout
  } = options
  const startTime = Date.now()

  while (true) {
    // Check for abort signal
    if (signal?.aborted) {
      return { type: 'QUEUE_DRAIN_TIMEOUT' }
    }

    // Check timeout
    if (Date.now() - startTime > timeoutMs) {
      console.warn(
        '[drainUploadQueue] Timeout reached, some data may not be synced'
      )
      onTimeout?.()
      return { type: 'QUEUE_DRAIN_TIMEOUT' }
    }

    // Get accurate queue count from ps_crud table
    const queueCount = await getUploadQueueCount(powersync)

    if (queueCount === 0) {
      // Queue is empty, safe to switch to local
      return { type: 'QUEUE_DRAINED' }
    }

    // Report accurate progress
    onProgress?.(queueCount)

    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
