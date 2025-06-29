import { powerSyncDb } from '@/lib/powersync/system'
import { powerSyncStore } from '@/lib/storage/powersync-store'
import { useAuth } from '@clerk/clerk-expo'
import { PowerSyncContext } from '@powersync/react'
import React from 'react'
import { Connector } from './connector'

export function PowerSyncContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn } = useAuth()
  const connectorRef = React.useRef<Connector | null>(null)

  const {
    setIsConnected,
    setIsConnecting,
    setIsSyncing,
    setHasSynced,
    setLastSyncedAt,
    setError
  } = powerSyncStore(state => state.actions)

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
  }, [isSignedIn, setIsConnecting, setError])

  // Monitor PowerSync status changes
  React.useEffect(() => {
    const handleStatusChange = (status: any) => {
      setIsConnected(status.connected)
      setHasSynced(status.hasSynced || false)
      setLastSyncedAt(status.lastSyncedAt || null)
      setIsSyncing(
        !!status.downloadProgress &&
          status.downloadProgress.downloadedOperations <
            status.downloadProgress.totalOperations
      )
    }

    const unsubscribe = powerSyncDb.registerListener({
      statusChanged: handleStatusChange
    })

    return unsubscribe
  }, [setIsConnected, setHasSynced, setLastSyncedAt, setIsSyncing])

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      powerSyncDb.close().catch(() => {})
    }
  }, [])

  return (
    <PowerSyncContext.Provider value={powerSyncDb}>
      {children}
    </PowerSyncContext.Provider>
  )
}
