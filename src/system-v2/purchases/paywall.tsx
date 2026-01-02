import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import RevenueCatUI from 'react-native-purchases-ui'

/**
 * Paywall component - subscription activation will be handled by the orchestrator
 * when RevenueCat updates the purchases store
 */
export function Paywall() {
  const handleClose = () => router.back()

  return (
    <View className="flex-1">
      <RevenueCatUI.Paywall
        options={{
          displayCloseButton: true
        }}
        onPurchaseCompleted={handleClose}
        onRestoreCompleted={handleClose}
        onDismiss={handleClose}
      />
    </View>
  )
}
