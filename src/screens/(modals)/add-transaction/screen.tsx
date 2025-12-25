import { Calculator } from '@/components/calculator'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { categoryTotalAnimationStore } from '@/lib/storage/category-total-animation-store'
import { useUserSession } from '@/system/session-and-migration'
import * as Sentry from '@sentry/react-native'
import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ParamsSelection } from './components/params-selection'
import { useTransactionParamsActions, useTransactionParamsState } from './store'
import {
  closeTransactionBottomSheet,
  determineSubmitWorkflow,
  submitTransaction
} from './utils'

export default function AddTransaction() {
  const { userId } = useUserSession()
  const params = useTransactionParamsState()
  const { type } = params
  const { clearParams } = useTransactionParamsActions()

  // Clear params when component unmounts
  useEffect(() => () => clearParams(), [clearParams])

  const handleSubmit = async (
    amount: number,
    comment: string,
    txDate?: Date
  ) => {
    if (amount <= 0) return

    const [error] = await submitTransaction(userId, {
      amount,
      comment,
      txDate
    })

    if (error) {
      Sentry.captureException(error, {
        tags: {
          context:
            type === 'transfer'
              ? 'add-transaction:transfer'
              : 'add-transaction:expense-income'
        },
        extra: { params }
      })
      return
    }

    // Mark that a transaction was just created - any category whose
    // total changes within the next 2 seconds will animate
    categoryTotalAnimationStore.getState().markTransactionCreated()

    closeTransactionBottomSheet()
  }

  const insets = useSafeAreaInsets()

  // TODO: Find a better way to handle this in a cross-platform way
  const Container = Platform.OS === 'ios' ? SafeAreaView : View

  return (
    <Container
      style={{
        paddingBottom:
          Platform.OS === 'ios'
            ? insets.bottom >= 12
              ? 0
              : 12 - insets.bottom
            : Math.max(12, insets.bottom)
      }}
      className="bg-popover p-4"
    >
      <ParamsSelection />

      <Calculator
        isDisabled={!Boolean(determineSubmitWorkflow(params))}
        handleSubmit={handleSubmit}
      />
    </Container>
  )
}
