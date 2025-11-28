import React from 'react'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { Header } from './components/header'
import { ModeSelection } from './components/mode-selection'

export default function ModalTransactionsDateRange() {
  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      <Header />
      <ModeSelection />
    </SafeAreaView>
  )
}
