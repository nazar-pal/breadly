import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { sqliteSchema } from '@/data/client/db-schema'
import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { switchToLocalSchema } from '@/system/powersync/utils'
import { useClerk } from '@clerk/clerk-expo'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { usePowerSync } from '@powersync/react-native'
import { randomUUID } from 'expo-crypto'
import * as Linking from 'expo-linking'
import { View } from 'react-native'
import { insertDefaultDataIntoDatabase } from '../data/mutations'
import { userSessionStore } from '../store'

export function SignOutButton() {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const {
    reset: resetSessionPersistentStore,
    guestId: existingGuestId,
    setGuestId
  } = useSessionPersistentStore()
  const powersync = usePowerSync()

  const handleSignOut = async () => {
    try {
      // Snapshot latest currencies while still in synced mode (if available)
      let currenciesSnapshot: (typeof sqliteSchema.currencies.$inferSelect)[] =
        []
      try {
        const db = wrapPowerSyncWithDrizzle(powersync, {
          schema: sqliteSchema
        })
        currenciesSnapshot = await db.select().from(sqliteSchema.currencies)
      } catch (err) {
        if (__DEV__) console.warn('Currencies snapshot skipped:', err)
      }

      // Step 1: Sign out from Clerk
      await signOut()
      await powersync.disconnectAndClear({
        clearLocal: existingGuestId === null
      })
      resetSessionPersistentStore()
      await switchToLocalSchema(powersync)

      // Restore latest currencies into local-only table if we had a snapshot
      if (currenciesSnapshot.length > 0) {
        try {
          const db = wrapPowerSyncWithDrizzle(powersync, {
            schema: sqliteSchema
          })
          await db.transaction(async tx => {
            await tx.delete(sqliteSchema.currencies)
            await tx.insert(sqliteSchema.currencies).values(currenciesSnapshot)
          })
        } catch (err) {
          if (__DEV__)
            console.warn('Restore currencies after sign out skipped:', err)
        }
      }

      // Step 2: Reset PowerSync database and create new guest session
      if (__DEV__) console.log('🔄 Starting database reset after sign out')
      const newGuestUserId = existingGuestId ?? randomUUID()
      setGuestId(newGuestUserId)

      if (!existingGuestId) {
        await insertDefaultDataIntoDatabase(newGuestUserId)
      }

      if (__DEV__)
        console.log(
          `✅ Database reset successful. New guest ID: ${newGuestUserId}`
        )

      // Step 3: Update user session store to guest state with new ID
      userSessionStore.setState({
        session: {
          userId: newGuestUserId,
          isGuest: true
        },
        isInitializing: false
      })

      // Step 4: Redirect to home page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Sign out failed:', JSON.stringify(err, null, 2))

      // Fallback: reset session state even if sign out failed
      userSessionStore.setState({ session: null, isInitializing: true })
    }
  }

  return (
    <Button
      variant="destructive"
      onPress={handleSignOut}
      className="h-14 w-full rounded-xl"
    >
      <View className="flex-row items-center gap-2">
        <Icon name="LogOut" size={20} className="text-destructive-foreground" />
        <Text className="text-base font-semibold">Sign Out</Text>
      </View>
    </Button>
  )
}
