import { Paywall } from '@/system/purchases/paywall'
import React from 'react'
import { Platform } from 'react-native'

export default function PaywallScreen() {
  if (Platform.OS === 'web') return null
  return <Paywall />
}
