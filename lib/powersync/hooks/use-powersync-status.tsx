import { powerSyncDb } from '@/lib/powersync/system'
import React from 'react'

// Custom hook to monitor PowerSync status
export function usePowerSyncStatus() {
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
