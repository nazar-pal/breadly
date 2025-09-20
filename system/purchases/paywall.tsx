import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { router } from 'expo-router'
import React from 'react'
import RevenueCatUI from 'react-native-purchases-ui'

export function Paywall() {
  const { setSyncEnabled } = useSessionPersistentStore()

  const handleClose = () => router.back()
  const handleSuccess = () => {
    setSyncEnabled(true)
    handleClose()
  }

  return (
    <RevenueCatUI.Paywall
      options={{
        displayCloseButton: true
      }}
      onPurchaseCompleted={handleSuccess}
      onRestoreCompleted={handleSuccess}
      onDismiss={handleClose}
    />
  )
}
