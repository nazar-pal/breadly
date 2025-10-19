import { Calculator } from '@/components/calculator'
import { useUserSession } from '@/system/session-and-migration'
import * as Sentry from '@sentry/react-native'
import React, { useEffect } from 'react'
import {
  useTransactionParamsActions,
  useTransactionParamsState
} from '../store'
import {
  closeTransactionBottomSheet,
  determineSubmitWorkflow,
  submitTransaction
} from '../utils'
import { ParamsSelection } from './params-selection'

export function AddTransaction() {
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
    <>
      <ParamsSelection />

      <Calculator
        isDisabled={!Boolean(determineSubmitWorkflow(params))}
        handleSubmit={handleSubmit}
      />
    </>
  )
}
