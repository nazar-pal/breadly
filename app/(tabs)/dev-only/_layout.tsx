import { Slot } from 'expo-router'
import React from 'react'

export default function Layout() {
  if (!__DEV__) return null
  return <Slot />
}
