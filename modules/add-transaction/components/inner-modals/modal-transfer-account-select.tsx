import { Text } from '@/components/ui/text'
import { useGetAccounts } from '@/data/client/queries'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import { useGetAccountsByCurrency } from '@/modules/account/data/queries'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { ParamsModalShell } from './params-modal-shell'

export function AccountTransferModal({
  visible,
  direction,
  selectedAccountId,
  onSelectAccount,
  onClose,
  currencyId,
  excludeAccountId
}: {
  visible: boolean
  direction: 'From' | 'To'
  selectedAccountId: string
  onSelectAccount: (accountId: string) => void
  onClose: () => void
  currencyId?: string
  excludeAccountId?: string
}) {
  const { userId } = useUserSession()
  // Call both hooks (safe and simple), choose data based on presence of currencyId
  const { data: allAccounts = [] } = useGetAccounts({
    userId,
    accountType: 'payment'
  })
  const { data: sameCurrencyAccounts = [] } = useGetAccountsByCurrency({
    userId,
    currencyId: currencyId ?? '',
    excludeAccountId
  })

  const accounts = currencyId ? sameCurrencyAccounts : allAccounts

  return (
    <ParamsModalShell
      visible={visible}
      onClose={onClose}
      title={`Select ${direction} Account`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {accounts.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-sm text-muted-foreground">
              No accounts found
            </Text>
          </View>
        ) : (
          accounts.map(account => (
            <Pressable
              key={account.id}
              className={`my-1 rounded-xl border p-4 ${
                account.id === selectedAccountId
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-transparent active:bg-muted'
              }`}
              onPress={() => {
                onSelectAccount(account.id)
                onClose()
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="mr-3 rounded-lg bg-primary/10 p-2">
                    <Text className="text-sm font-semibold text-primary">
                      {account.currency?.symbol || '$'}
                    </Text>
                  </View>
                  <Text className="text-base font-medium text-foreground">
                    {account.name}
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {formatCurrencyWithSign(
                    account.balance ?? 0,
                    account.currency?.code || 'USD'
                  )}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ParamsModalShell>
  )
}
