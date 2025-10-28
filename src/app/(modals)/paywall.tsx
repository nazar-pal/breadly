import { Paywall } from '@/system/purchases/paywall'
import React from 'react'
import { Platform, View } from 'react-native'

export default function PaywallScreen() {
  if (Platform.OS === 'web') return null
  return (
    <View className="flex-1">
      <Paywall />
    </View>
  )
}
