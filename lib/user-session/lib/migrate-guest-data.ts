import { Storage } from '@/lib/storage'
import { GUEST_KEY } from './constants'

export async function migrateGuestDataToUser(
  guestUserId: string,
  authenticatedUserId: string
) {
  const { migrateGuestDataToAuthenticatedUser } = await import(
    '@/lib/powersync/data/migrations'
  )

  console.log(
    `Migrating data from guest ${guestUserId} to user ${authenticatedUserId}`
  )

  const result = await migrateGuestDataToAuthenticatedUser(
    guestUserId,
    authenticatedUserId
  )

  if (!result.success) {
    throw result.error || new Error('Migration failed')
  }

  // Clear the guest ID after successful migration
  Storage.removeItem(GUEST_KEY)
}
