import { Calculator } from '@/components/calculator'
import { useUserSession } from '@/system/session-and-migration'
import * as Sentry from '@sentry/react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
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

    closeTransactionBottomSheet()
  }

  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      <ParamsSelection />

      <Calculator
        isDisabled={!Boolean(determineSubmitWorkflow(params))}
        handleSubmit={handleSubmit}
      />
    </SafeAreaView>
  )
}
