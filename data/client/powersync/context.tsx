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

  React.useEffect(() => {
    isMountedRef.current = true
    let isActive = true

    async function handleConnection() {
      if (!isActive) return

      if (isSignedIn) {
        if (!connectorRef.current) {
          connectorRef.current = new Connector()
        }

        await powerSyncDb.connect(connectorRef.current)
      } else {
        await powerSyncDb.disconnect().catch(() => {})
        connectorRef.current = null
        if (isActive) {
        }
      }
    }

    handleConnection()

    return () => {
      isActive = false
      isMountedRef.current = false
    }
  }, [isSignedIn])

  return (
    <PowerSyncContext.Provider value={powerSyncDb}>
      {children}
    </PowerSyncContext.Provider>
  )
}
