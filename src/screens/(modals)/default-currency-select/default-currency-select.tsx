import { router } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { CurrencyList } from './components/modal-currencie-list'

export default function DefaultCurrencySelect() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="p-4"
      contentContainerClassName="pb-12"
    >
      <CurrencyList closeModal={() => router.back()} />
    </ScrollView>
  )
}
