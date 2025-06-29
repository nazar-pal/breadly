import React from 'react'
import { ExtendedPowerSyncContext } from '../context'

// Hook to use the context
export const usePowerSync = () => {
  const context = React.useContext(ExtendedPowerSyncContext)
  if (!context) {
    throw new Error('usePowerSync must be used within PowerSyncContextProvider')
  }
  return context
}
