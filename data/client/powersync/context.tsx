import { powerSyncStore } from '@/lib/storage/powersync-store'
import { useAuth } from '@clerk/clerk-expo'
import { PowerSyncContext } from '@powersync/react'
import React from 'react'
import { Connector } from './connector'
import { powerSyncDb } from './system'

export function PowerSyncContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn } = useAuth()
  const connectorRef = React.useRef<Connector | null>(null)
  const isMountedRef = React.useRef(true)

  const actions = powerSyncStore(state => state.actions)

  React.useEffect(() => {
    isMountedRef.current = true
    let isActive = true

    async function handleConnection() {
      if (!isActive) return

      if (isSignedIn) {
        try {
          actions.setIsConnecting(true)
          actions.setError(null)

          if (!connectorRef.current) {
            connectorRef.current = new Connector()
          }

          await powerSyncDb.connect(connectorRef.current)
        } catch (err) {
          if (isActive) {
            actions.setError(
              err instanceof Error ? err : new Error('Cloud connection failed')
            )
          }
        } finally {
          if (isActive) {
            actions.setIsConnecting(false)
          }
        }
      } else {
        await powerSyncDb.disconnect().catch(() => {})
        connectorRef.current = null
        if (isActive) {
          actions.setError(null)
          actions.setIsConnecting(false)
        }
      }
    }

    handleConnection()

    return () => {
      isActive = false
      isMountedRef.current = false
    }
  }, [isSignedIn, actions])

  React.useEffect(() => {
    const handleStatusChange = (status: any) => {
      if (!isMountedRef.current) return

      powerSyncStore.setState({
        isConnected: status.connected,
        hasSynced: status.hasSynced || false,
        lastSyncedAt: status.lastSyncedAt || null,
        isSyncing:
          !!status.downloadProgress &&
          status.downloadProgress.downloadedOperations <
            status.downloadProgress.totalOperations
      })
    }

    const unsubscribe = powerSyncDb.registerListener({
      statusChanged: handleStatusChange
    })

    return unsubscribe
  }, [])

  return (
    <PowerSyncContext.Provider value={powerSyncDb}>
      {children}
    </PowerSyncContext.Provider>
  )
}
