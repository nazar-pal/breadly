import { Storage } from '@/lib/storage/mmkv'
import { GUEST_KEY } from '@/lib/storage/mmkv/keys'
import { asyncTryCatch } from '@/lib/utils/index'
import { randomUUID } from 'expo-crypto'
import { powerSyncDb } from '../system'
import { insertDefaultDataIntoDatabase } from './seeding/insert-default-data'

/**
 * Completely resets the PowerSync database and creates a new guest session.
 * This function:
 * 1. Disconnects from PowerSync and clears all local data
 * 2. Creates a new guest user ID
 * 3. Seeds default data for the new guest user
 * 4. Updates local storage with the new guest ID
 *
 * This is typically called when a user signs out to ensure the database
 * is completely clean for the next user session.
 *
 * @returns Promise with success status, new guest user ID, and optional error
 */
export async function resetDatabaseAndCreateGuestSession(): Promise<{
  success: boolean
  newGuestUserId?: string
  error?: Error
}> {
  console.log(`🔄 [DATABASE_RESET] Starting complete database reset`)

  try {
    // Step 1: Disconnect PowerSync and clear all local data
    if (__DEV__)
      console.log(`🗑️ [DATABASE_RESET] Disconnecting and clearing database`)
    await powerSyncDb.disconnectAndClear({
      clearLocal: true // Clear all data including local-only tables
    })

    // Step 2: Generate a new guest user ID
    const newGuestUserId = randomUUID()
    if (__DEV__)
      console.log(
        `🆔 [DATABASE_RESET] Generated new guest user ID: ${newGuestUserId}`
      )

    // Step 3: Update local storage with new guest ID
    Storage.setItem(GUEST_KEY, newGuestUserId)
    if (__DEV__)
      console.log(`💾 [DATABASE_RESET] Updated local storage with new guest ID`)

    // Step 4: Seed default data for the new guest user
    if (__DEV__)
      console.log(`🌱 [DATABASE_RESET] Seeding default data for new guest user`)
    const [seedError] = await asyncTryCatch(
      insertDefaultDataIntoDatabase(newGuestUserId)
    )

    if (seedError) {
      throw seedError
    }

    if (__DEV__)
      console.log(`✅ [DATABASE_RESET] Database reset completed successfully`)
    return {
      success: true,
      newGuestUserId
    }
  } catch (error) {
    console.error(`❌ [DATABASE_RESET] Database reset failed:`, error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}
