import { Connector } from '@/lib/powersync/connector'
import { db, powerSyncDb } from '@/lib/powersync/system'
import { useAuth } from '@clerk/clerk-expo'
import { PowerSyncContext } from '@powersync/react'
import React from 'react'

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
const ExtendedPowerSyncContext = React.createContext<PowerSyncContextValue>({
  db,
  powerSyncDb,
  isConnected: false,
  isConnecting: false,
  isSyncing: false,
  hasSynced: false,
  lastSyncedAt: null,
  error: null
})

// Hook to use the context
export const usePowerSync = () => {
  const context = React.useContext(ExtendedPowerSyncContext)
  if (!context) {
    throw new Error('usePowerSync must be used within PowerSyncContextProvider')
  }
  return context
}

// Custom hook to monitor PowerSync status
function usePowerSyncStatus() {
  const [isConnected, setIsConnected] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [hasSynced, setHasSynced] = React.useState(false)
  const [lastSyncedAt, setLastSyncedAt] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const handleStatusChange = (status: any) => {
      setIsConnected(status.connected)
      setHasSynced(status.hasSynced || false)
      setLastSyncedAt(status.lastSyncedAt || null)

      // Check if actively syncing
      const progress = status.downloadProgress
      setIsSyncing(
        !!progress && progress.downloadedOperations < progress.totalOperations
      )
    }

    const unsubscribe = powerSyncDb.registerListener({
      statusChanged: handleStatusChange
    })

    return unsubscribe
  }, [])

  return { isConnected, isSyncing, hasSynced, lastSyncedAt }
}

/**
 * Provider that manages the PowerSync client lifecycle.
 */
export function PowerSyncContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const connectorRef = React.useRef<Connector | null>(null)

  // Monitor PowerSync status
  const { isConnected, isSyncing, hasSynced, lastSyncedAt } =
    usePowerSyncStatus()

  // Handle authentication changes
  React.useEffect(() => {
    if (!isLoaded) return

    async function handleConnection() {
      if (isSignedIn) {
        try {
          setIsConnecting(true)
          setError(null)

          if (!connectorRef.current) {
            connectorRef.current = new Connector()
          }

          await powerSyncDb.connect(connectorRef.current)
          console.log('PowerSync connected')
        } catch (err) {
          console.error('PowerSync connection error:', err)
          setError(err instanceof Error ? err : new Error('Connection failed'))
        } finally {
          setIsConnecting(false)
        }
      } else {
        // Disconnect on sign out
        await powerSyncDb.close().catch(() => {})
        connectorRef.current = null
        setError(null)
      }
    }

    handleConnection()
  }, [isLoaded, isSignedIn])

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
