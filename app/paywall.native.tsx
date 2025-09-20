import { Paywall } from '@/system/purchases/paywall'
import React from 'react'
import { View } from 'react-native'

export default function PaywallScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Paywall />
    </View>
  )
}
