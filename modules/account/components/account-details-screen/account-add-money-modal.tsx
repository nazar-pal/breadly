import { Calculator } from '@/components/calculator'
import { Modal } from '@/components/modals/modal'
import { Text } from '@/components/ui/text'
import { createTransaction } from '@/data/client/mutations'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { View } from 'react-native'
import { AccountDetails } from '../../data'

interface Props {
  account: AccountDetails
  visible: boolean
  onClose: () => void
}

export function AccountAddMoneyModal({ account, visible, onClose }: Props) {
  const { userId } = useUserSession()

  const currencyCode = account.currency?.code ?? account.currencyId ?? 'USD'

  const handleSubmit = async (
    amount: number,
    comment: string,
    txDate?: Date
  ) => {
    if (!userId) return
    const [error] = await createTransaction({
      userId,
      data: {
        type: 'income',
        accountId: account.id,
        amount,
        currencyId: account.currencyId,
        txDate: txDate ?? new Date(),
        notes: comment || null,
        createdAt: new Date()
      }
    })
    if (!error) onClose()
  }

  return (
    <Modal
      isVisible={visible}
      onClose={onClose}
      title="Add Money"
      height="auto"
    >
      <View className="px-6 pb-4">
        <Calculator
          type="income"
          isDisabled={false}
          handleSubmit={handleSubmit}
        />
        <Text className={cn('mt-2 text-center text-xs text-muted-foreground')}>
          Currency: {currencyCode}
        </Text>
      </View>
    </Modal>
  )
}
