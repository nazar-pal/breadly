import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { usePurchasesStore } from '@/system/purchases'
import { useUserSession } from '@/system/session-and-migration'
import { UserSessionLoading } from '@/system/session-and-migration/components/user-session-loading'
import { migrateGuestDataToAuthenticatedUser } from '@/system/session-and-migration/data/mutations'
import {
  useUserSessionActions,
  useUserSessionInitializingState
} from '@/system/session-and-migration/store'
import { seedDefaultDataForGuestUser } from '@/system/session-and-migration/utils/seed-default-data-for-guest-user'
import {
  createBaseLogger,
  LogLevel,
  PowerSyncContext
} from '@powersync/react-native'
import React from 'react'
import { Connector } from './connector'
import { powersync as powerSyncDatabase } from './system'
import { switchToLocalSchema, switchToSyncedSchema } from './utils'

export function PowerSyncContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [powersync] = React.useState(powerSyncDatabase)
  const [connector] = React.useState(new Connector())

  const { userId, isGuest } = useUserSession()
  const { isPremium, isCustomerInfoFresh } = usePurchasesStore()
  const {
    syncEnabled,
    needToReplaceGuestWithAuthUserId,
    needToSeedDefaultDataForGuestUser,
    guestId,
    setSyncEnabled,
    removeGuestId,
    setNeedToReplaceGuestWithAuthUserId,
    setNeedToSeedDefaultDataForGuestUser
  } = useSessionPersistentStore()

  const { isMigrating } = useUserSessionInitializingState()
  const { setIsMigrating } = useUserSessionActions()

  React.useEffect(() => {
    const logger = createBaseLogger()
    logger.useDefaults()
    logger.setLevel(LogLevel.DEBUG)

    async function handleGuest() {
      if (!guestId) {
        return // this should not be possible
      }

      await switchToLocalSchema(powersync, syncEnabled ? { userId } : undefined)

      if (needToSeedDefaultDataForGuestUser) {
        const { success } = await seedDefaultDataForGuestUser(userId)
        if (success) setNeedToSeedDefaultDataForGuestUser(false)
      }
    }

    async function handleAuthed() {
      // Only toggle syncEnabled when we have fresh network-verified purchases info
      if (isCustomerInfoFresh) {
        if (isPremium && !syncEnabled) setSyncEnabled(true)
        else if (!isPremium && syncEnabled) setSyncEnabled(false)
      }

      if (needToReplaceGuestWithAuthUserId) {
        if (guestId) {
          await migrateGuestDataToAuthenticatedUser(guestId, userId)
        }
        setNeedToReplaceGuestWithAuthUserId(false)
        removeGuestId()
      } else {
        if (syncEnabled) {
          await switchToSyncedSchema(powersync, userId)
        } else {
          await switchToLocalSchema(powersync, { userId })
        }
      }
    }

    const initialize = async () => {
      try {
        await powersync.init()

        setIsMigrating(true)

        if (isGuest) {
          await handleGuest()
        } else {
          await handleAuthed()
        }

        // Connect only when authenticated and sync is enabled
        if (!isGuest && syncEnabled) {
          powersync.connect(connector)
        }
      } catch (error) {
        console.error(
          '[PowerSyncContextProvider] Error during initialization:',
          error
        )
        throw error
      } finally {
        setIsMigrating(false)
      }
    }
    initialize()
  }, [
    connector,
    powersync,
    syncEnabled,
    userId,
    isGuest,
    guestId,
    needToReplaceGuestWithAuthUserId,
    needToSeedDefaultDataForGuestUser,
    removeGuestId,
    setNeedToReplaceGuestWithAuthUserId,
    setNeedToSeedDefaultDataForGuestUser,
    setIsMigrating,
    setSyncEnabled,
    isPremium,
    isCustomerInfoFresh
  ])

  if (
    needToReplaceGuestWithAuthUserId ||
    needToSeedDefaultDataForGuestUser ||
    isMigrating
  ) {
    return <UserSessionLoading message="Applying database changes..." />
  }

  return (
    <PowerSyncContext.Provider value={powersync}>
      {children}
    </PowerSyncContext.Provider>
  )
}
