import React from 'react'
import { View } from 'react-native'
import { Header } from './components/header'
import { ModeSelection } from './components/mode-selection'

export default function ModalTransactionsDateRange() {
  return (
    <View className="bg-popover android:pb-safe-or-4 ios:pb-0 p-4">
      <Header />
      <ModeSelection />
    </View>
  )
}
