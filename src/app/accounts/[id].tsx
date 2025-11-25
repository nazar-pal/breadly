import Account from '@/screens/account'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function AccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <Account id={id} />
}
