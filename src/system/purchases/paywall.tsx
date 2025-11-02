import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import RevenueCatUI from 'react-native-purchases-ui'

export function Paywall() {
  const { setSyncEnabled } = useSessionPersistentStore()

  const handleClose = () => router.back()
  const handleSuccess = () => {
    setSyncEnabled(true)
    handleClose()
  }

  return (
    <View className="flex-1">
      <RevenueCatUI.Paywall
        options={{
          displayCloseButton: true
        }}
        onPurchaseCompleted={handleSuccess}
        onRestoreCompleted={handleSuccess}
        onDismiss={handleClose}
      />
    </View>
  )
}
