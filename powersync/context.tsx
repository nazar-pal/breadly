import { Connector } from '@/powersync/connector'
import { powerSyncDb } from '@/powersync/system'
import { useAuth } from '@clerk/clerk-expo'
import { PowerSyncContext } from '@powersync/react'
import * as React from 'react'

export function PowerSyncContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const connectorRef = React.useRef<Connector | undefined>(undefined)

  React.useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      if (!connectorRef.current) connectorRef.current = new Connector()

      powerSyncDb.connect(connectorRef.current)
    } else {
      powerSyncDb.close()
      connectorRef.current = undefined
    }
  }, [isLoaded, isSignedIn])

  return (
    <PowerSyncContext.Provider value={powerSyncDb}>
      {children}
    </PowerSyncContext.Provider>
  )
}
