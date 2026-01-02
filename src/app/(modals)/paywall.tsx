import { Paywall } from '@/system-v2/purchases'
import React from 'react'
import { Platform } from 'react-native'

export default function PaywallScreen() {
  if (Platform.OS === 'web') return null
  return <Paywall />
}
