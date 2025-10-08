import { AddTransaction } from '@/modules/add-transaction'
import { AddTransferTransaction } from '@/modules/add-transaction/components/add-transfer-transaction'
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
      if (type === 'transfer')
        // Allow opening with only one side selected; the UI will enforce both before save
        return { fromAccountId, toAccountId, type }
      return undefined
    }
  )

export type TransactionParams = z.output<typeof searchParamsSchema>

export default function TransactionModalScreen() {
  const rawParams = useLocalSearchParams()

  const params = searchParamsSchema.parse(rawParams)

  const handleClose = () => router.back()

  if (!params) return handleClose()

  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      {params.type === 'transfer' ? (
        <AddTransferTransaction params={params} onClose={handleClose} />
      ) : (
        <AddTransaction params={params} onClose={handleClose} />
      )}
    </SafeAreaView>
  )
}
