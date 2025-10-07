import { useCategoryType } from '@/lib/hooks'
import { AddTransaction } from '@/modules/add-transaction'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TransactionModalScreen() {
  const activeCategoryType = useCategoryType()
  const params = useLocalSearchParams<{
    categoryId?: string
    accountId?: string
    currencyCode?: string
  }>()

  const categoryId = params.categoryId || ''
  const accountId = params.accountId || ''
  const currencyCode = params.currencyCode || 'USD'

  const handleClose = () => router.back()

  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      <AddTransaction
        type={activeCategoryType}
        categoryId={categoryId}
        accountId={accountId}
        currencyCode={currencyCode}
        onClose={handleClose}
      />
    </SafeAreaView>
  )
}
