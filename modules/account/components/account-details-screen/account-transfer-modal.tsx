import { Calculator } from '@/components/calculator'
import { CenteredModal } from '@/components/modals'
import { Modal } from '@/components/modals/modal'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { createTransaction } from '@/data/client/mutations'
import { cn } from '@/lib/utils'
import { useGetAccountsByCurrency } from '@/modules/account/data/queries'
import { useUserSession } from '@/system/session-and-migration'
import React, { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { AccountDetails } from '../../data'

interface Props {
  account: AccountDetails
  visible: boolean
  onClose: () => void
}

export function AccountTransferModal({ account, visible, onClose }: Props) {
  const { userId } = useUserSession()
  const [fromAccountId, setFromAccountId] = useState<string>(account.id)
  const [toAccountId, setToAccountId] = useState<string>('')
  const [showFromModal, setShowFromModal] = useState(false)
  const [showToModal, setShowToModal] = useState(false)

  const currencyCode = account.currency?.code ?? account.currencyId ?? 'USD'

  const { data: sameCurrencyAccounts = [] } = useGetAccountsByCurrency({
    userId,
    currencyId: account.currencyId ?? 'USD',
    excludeAccountId: account.id
  })

  const fromAccount = useMemo(
    () => sameCurrencyAccounts.find(a => a.id === fromAccountId) ?? account,
    [sameCurrencyAccounts, fromAccountId, account]
  )
  const toAccount = useMemo(
    () => sameCurrencyAccounts.find(a => a.id === toAccountId),
    [sameCurrencyAccounts, toAccountId]
  )

  const isFromArchived = Boolean(fromAccount?.isArchived)
  const isToArchived = Boolean(toAccount?.isArchived)

  const handleSubmit = async (
    amount: number,
    comment: string,
    txDate?: Date
  ) => {
    if (!userId || !fromAccount || !toAccount) return
    if (fromAccount.id === toAccount.id) return
    if (isFromArchived || isToArchived) return

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
        amount,
        currencyId: fromAccount.currencyId,
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
      title="Transfer"
      height="auto"
      additionalSafeAreaPadding={4}
    >
      <View className="px-6 pb-2">
        <View className="mb-3">
          <Text className="mb-1 text-xs text-muted-foreground">From</Text>
          <Pressable
            className="flex-row items-center justify-between rounded-2xl border border-border/40 bg-card px-3 py-2.5 shadow-sm active:bg-muted/50"
            onPress={() => setShowFromModal(true)}
          >
            <View className="flex-row items-center">
              <View className="mr-2 rounded-lg bg-primary/10 p-1">
                <Icon name="CreditCard" size={14} className="text-primary" />
              </View>
              <View>
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {fromAccount?.name || 'Select account'}
                </Text>
              </View>
            </View>
            <Icon
              name="ChevronDown"
              size={14}
              className="ml-1 text-muted-foreground"
            />
          </Pressable>
        </View>

        <View className="mb-3">
          <Text className="mb-1 text-xs text-muted-foreground">To</Text>
          <Pressable
            className="flex-row items-center justify-between rounded-2xl border border-border/40 bg-card px-3 py-2.5 shadow-sm active:bg-muted/50"
            onPress={() => setShowToModal(true)}
          >
            <View className="flex-row items-center">
              <View className="mr-2 rounded-lg bg-primary/10 p-1">
                <Icon name="CreditCard" size={14} className="text-primary" />
              </View>
              <View>
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {toAccount?.name || 'Select account'}
                </Text>
              </View>
            </View>
            <Icon
              name="ChevronDown"
              size={14}
              className="ml-1 text-muted-foreground"
            />
          </Pressable>
        </View>

        <Calculator
          type="expense"
          isDisabled={!toAccount || isFromArchived || isToArchived}
          handleSubmit={handleSubmit}
        />
        <Text className={cn('mt-2 text-center text-xs text-muted-foreground')}>
          Currency: {currencyCode}
        </Text>
        {isFromArchived ? (
          <Text className={cn('mt-1 text-center text-xs text-destructive')}>
            Source account is archived
          </Text>
        ) : null}
      </View>

      {/* From account picker */}
      <CenteredModal
        visible={showFromModal}
        onRequestClose={() => setShowFromModal(false)}
        className="max-h-[60%]"
      >
        <Text className="mb-3 text-xl font-semibold text-foreground">
          Select account
        </Text>
        <View className="max-h-96">
          <ScrollView showsVerticalScrollIndicator={false}>
            {[account, ...sameCurrencyAccounts].map(acc => (
              <Pressable
                key={acc.id}
                className={`my-1 rounded-xl border p-4 ${
                  acc.id === fromAccountId
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border bg-transparent active:bg-muted'
                }`}
                onPress={() => {
                  if (acc.isArchived) return
                  setFromAccountId(acc.id)
                  setShowFromModal(false)
                }}
                disabled={Boolean(acc.isArchived)}
                style={acc.isArchived ? { opacity: 0.6 } : undefined}
              >
                <Text className="text-base font-medium text-foreground">
                  {acc.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </CenteredModal>

      {/* To account picker */}
      <CenteredModal
        visible={showToModal}
        onRequestClose={() => setShowToModal(false)}
        className="max-h-[60%]"
      >
        <Text className="mb-3 text-xl font-semibold text-foreground">
          Select account
        </Text>
        <View className="max-h-96">
          <ScrollView showsVerticalScrollIndicator={false}>
            {sameCurrencyAccounts.length === 0 ? (
              <View className="items-center justify-center py-8">
                <Text className="text-sm text-muted-foreground">
                  No eligible accounts found
                </Text>
              </View>
            ) : (
              sameCurrencyAccounts.map(acc => (
                <Pressable
                  key={acc.id}
                  className={`my-1 rounded-xl border p-4 ${
                    acc.id === toAccountId
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-transparent active:bg-muted'
                  }`}
                  onPress={() => {
                    if (acc.isArchived) return
                    setToAccountId(acc.id)
                    setShowToModal(false)
                  }}
                  disabled={Boolean(acc.isArchived)}
                  style={acc.isArchived ? { opacity: 0.6 } : undefined}
                >
                  <Text className="text-base font-medium text-foreground">
                    {acc.name}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </CenteredModal>
    </Modal>
  )
}
