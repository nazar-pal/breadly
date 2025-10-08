import { AddTransaction } from '@/modules/add-transaction'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

const searchParamsSchema = z
  .object({
    type: z.enum(['expense', 'income', 'transfer']),
    categoryId: z.string().optional(),
    currencyCode: z.string().optional(),
    accountId: z.string().optional(),
    fromAccountId: z.string().optional(),
    toAccountId: z.string().optional()
  })
  .transform(
    ({
      categoryId,
      accountId,
      currencyCode,
      fromAccountId,
      toAccountId,
      type
    }) => {
      if (categoryId && accountId && type !== 'transfer')
        return { categoryId, accountId, type }
      if (categoryId && currencyCode && type !== 'transfer')
        return { categoryId, currencyCode, type }
      if (fromAccountId && toAccountId && type === 'transfer')
        return { fromAccountId, toAccountId, type }
      return undefined
    }
  )

export type TransactionParams = z.output<typeof searchParamsSchema>

export default function TransactionModalScreen() {
  const rawParams = useLocalSearchParams()

  const params = searchParamsSchema.parse(rawParams)
  const handleClose = () => router.back()

  if (!params) {
    handleClose()
    return null
  }
  // Check if it's a transfer or expense/income
  const isTransfer = params.type === 'transfer'

  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      {isTransfer ? (
        // TODO: Add Transfer component
        <></>
      ) : (
        <AddTransaction params={params} onClose={handleClose} />
      )}
    </SafeAreaView>
  )
}
