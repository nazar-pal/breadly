import { TransactionParams } from '@/app/transaction-modal'
import { Calculator } from '@/components/calculator'
import { createTransaction } from '@/data/client/mutations'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import { useGetAccount } from '../lib/use-get-account'
import { AccountTransferModal } from './inner-modals/modal-transfer-account-select'
import { SelectionTrigger } from './selection-trigger'

interface Props {
  params: Extract<TransactionParams, { type: 'transfer' }>
  onClose: () => void
}

export function AddTransferTransaction({ params, onClose }: Props) {
  const { userId } = useUserSession()

  const { fromAccountId, toAccountId } = params

  const [showFromModal, setShowFromModal] = useState(false)
  const [showToModal, setShowToModal] = useState(false)

  const { data: fromAccountData = [] } = useGetAccount({
    userId,
    accountId: fromAccountId ?? ''
  })
  const fromAccount = fromAccountData.length > 0 ? fromAccountData[0] : null

  const { data: toAccountData = [] } = useGetAccount({
    userId,
    accountId: toAccountId ?? ''
  })
  const toAccount = toAccountData.length > 0 ? toAccountData[0] : null

  const handleSubmit = async (
    amount: number,
    comment: string,
    txDate?: Date
  ) => {
    if (!userId || !fromAccount || !toAccount) return
    if (fromAccount.id === toAccount.id) return
    if (fromAccount.currencyId !== toAccount.currencyId) {
      Alert.alert(
        'Currency mismatch',
        'You can only transfer between accounts with the same currency.'
      )
      return
    }

    const available = Number(fromAccount.balance || 0)
    if (amount > available) {
      Alert.alert(
        'Insufficient funds',
        'You cannot transfer more than available in the source account.'
      )
      return
    }

    const [error] = await createTransaction({
      userId,
      data: {
        type: 'transfer',
        accountId: fromAccount.id,
        counterAccountId: toAccount.id,
        amount: amount,
        currencyId: fromAccount.currencyId,
        txDate: txDate ?? new Date(),
        notes: comment || null,
        createdAt: new Date()
      }
    })

    if (error) {
      Alert.alert('Transfer failed', String((error as any)?.message || error))
    } else {
      onClose()
    }
  }

  return (
    <>
      {/* From / To Account Selection */}
      <View className="mb-4 flex-row gap-2">
        <SelectionTrigger
          label="From Account"
          value={fromAccount?.name || 'Select From Account'}
          iconName="CreditCard"
          onPress={() => setShowFromModal(true)}
        />

        <SelectionTrigger
          label="To Account"
          value={toAccount?.name || 'Select To Account'}
          iconName="CreditCard"
          onPress={() => setShowToModal(true)}
        />
      </View>

      <Calculator
        type={'expense'}
        isDisabled={!fromAccount || !toAccount}
        handleSubmit={handleSubmit}
      />

      {/* Modals */}
      <AccountTransferModal
        visible={showFromModal}
        direction="From"
        selectedAccountId={fromAccountId ?? ''}
        onSelectAccount={id => {
          router.setParams({
            fromAccountId: id,
            // reset "to" if it matches the newly selected "from"
            toAccountId: id === toAccountId ? '' : (toAccountId ?? '')
          })
        }}
        currencyId={undefined}
        excludeAccountId={undefined}
        onClose={() => setShowFromModal(false)}
      />

      <AccountTransferModal
        visible={showToModal}
        direction="To"
        selectedAccountId={toAccountId ?? ''}
        onSelectAccount={id => {
          router.setParams({ toAccountId: id })
        }}
        currencyId={fromAccount?.currencyId}
        excludeAccountId={fromAccount?.id}
        onClose={() => setShowToModal(false)}
      />
    </>
  )
}
