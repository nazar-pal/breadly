import { Connector } from '@/lib/powersync/connector'
import { db, powerSyncDb } from '@/lib/powersync/system'
import { useAuth } from '@clerk/clerk-expo'
import { PowerSyncContext } from '@powersync/react'
import React from 'react'
import { usePowerSyncStatus } from './hooks/'

// Types
type PowerSyncContextValue = {
  db: typeof db
  powerSyncDb: typeof powerSyncDb
  isConnected: boolean
  isConnecting: boolean
  isSyncing: boolean
  hasSynced: boolean
  lastSyncedAt: Date | null
  error: Error | null
}

// Context
export const ExtendedPowerSyncContext =
  React.createContext<PowerSyncContextValue>({
    db,
    powerSyncDb,
    isConnected: false,
    isConnecting: false,
    isSyncing: false,
    hasSynced: false,
    lastSyncedAt: null,
    error: null
  })

/**
 * Provider that manages the PowerSync client lifecycle.
 * Local database works for all users, cloud sync only for authenticated users.
 */
export function PowerSyncContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn } = useAuth()
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const connectorRef = React.useRef<Connector | null>(null)

  // Monitor PowerSync status
  const { isConnected, isSyncing, hasSynced, lastSyncedAt } =
    usePowerSyncStatus()

  // Handle cloud sync connection (only for authenticated users)
  React.useEffect(() => {
    async function handleConnection() {
      if (isSignedIn) {
        try {
          setIsConnecting(true)
          setError(null)

          if (!connectorRef.current) {
            connectorRef.current = new Connector()
          }

          await powerSyncDb.connect(connectorRef.current)
          console.log(
            '☁️ PowerSync cloud sync connected for authenticated user'
          )
        } catch (err) {
          console.error('❌ PowerSync cloud connection error:', err)
          setError(
            err instanceof Error ? err : new Error('Cloud connection failed')
          )
        } finally {
          setIsConnecting(false)
        }
      } else {
        // Disconnect cloud sync but keep local database open
        await powerSyncDb.disconnect().catch(() => {})
        connectorRef.current = null
        setError(null)
        setIsConnecting(false)
        console.log('👤 Guest user: local database only (no cloud sync)')
      }
    }

    handleConnection()
  }, [isSignedIn])

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      powerSyncDb.close().catch(() => {})
    }
  }, [])

  const contextValue: PowerSyncContextValue = {
    db,
    powerSyncDb,
    isConnected,
    isConnecting,
    isSyncing,
    hasSynced,
    lastSyncedAt,
    error
  }

  return (
    <PowerSyncContext.Provider value={powerSyncDb}>
      <ExtendedPowerSyncContext.Provider value={contextValue}>
        {children}
      </ExtendedPowerSyncContext.Provider>
    </PowerSyncContext.Provider>
  )
}
