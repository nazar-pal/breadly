import { asyncTryCatch } from '@/lib/utils'
import { insertDefaultDataIntoDatabase } from '../data/mutations'
import { checkDbForGuestData } from '../data/queries'

/**
 * Seeds default categories and accounts for a new guest user on first app launch.
 *
 * Ensures first-time guests immediately see meaningful data (better onboarding),
 * while avoiding duplication by checking the database first. Only seeds users
 * who have no existing data.
 *
 * @param guestUserId - The unique guest user ID to seed data for
 * @returns Promise with success status and optional error
 */
export async function seedDefaultDataForGuestUser(
  guestUserId: string
): Promise<{ success: boolean; error?: Error }> {
  if (__DEV__) {
    console.log(`🌱 [SEEDING] Check seeding for ${guestUserId}`)
  }

  // Secondary check: Does this user already have data in the database?
  const hasExistingData = await checkDbForGuestData(guestUserId)
  if (hasExistingData) {
    if (__DEV__) {
      console.log(`⏭️ ${guestUserId} already has data, skip seeding`)
    }

    return { success: true }
  }

  // User is genuinely new - proceed with seeding
  if (__DEV__) {
    console.log(`🚀 Seeding needed for ${guestUserId}`)
  }

  const [error] = await asyncTryCatch(
    insertDefaultDataIntoDatabase(guestUserId)
  )

  if (error) {
    console.error(
      `❌ [SEEDING] Failed to seed data for user ${guestUserId}:`,
      error
    )
    return { success: false, error }
  }

  if (__DEV__) {
    console.log(`🎉 Seeding done for ${guestUserId}`)
  }

  return { success: true }
}
