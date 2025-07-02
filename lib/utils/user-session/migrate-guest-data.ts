export async function migrateGuestData(
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
}
