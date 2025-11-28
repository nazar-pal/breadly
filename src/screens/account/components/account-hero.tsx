import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { cn, formatCurrency } from '@/lib/utils'
import { openTransferBottomSheet } from '@/screens/(modals)/add-transaction'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View } from 'react-native'
import { DetailsHeaderActions } from './account-header/account-header-actions'
import { AccountHeaderBadge } from './account-header/account-header-badge'

export function AccountHero({ account }: { account: GetAccountResultItem }) {
  const isDebt = account.type === 'debt'
  // Positive balance = someone owes you (receivable)
  // Negative balance = you owe someone (payable)
  const isReceivable = isDebt && account.balance > 0
  const currencyCode = account.currency?.code ?? account.currencyId ?? 'USD'

  const handleOpenTransfer = () =>
    openTransferBottomSheet({
      type: 'transfer',
      fromAccountId: account.id,
      toAccountId: null
    })

  const gradientColors: [string, string] =
    account.type === 'saving'
      ? ['#10b9811A', '#10b98133']
      : account.type === 'debt'
        ? [
            isReceivable ? '#0596691A' : '#ef44441A',
            isReceivable ? '#05966933' : '#ef444433'
          ]
        : ['#3b82f61A', '#3b82f633']

  // Accent color available if needed for future UI accents

  return (
    <Card className="mb-4 overflow-hidden border-0 bg-transparent shadow-none">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16 }}
      >
        <CardContent className="py-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="min-w-0 flex-1 pr-3">
              <Text
                numberOfLines={1}
                className="text-foreground text-2xl font-bold"
              >
                {account.name}
              </Text>
              <View className="mt-1 flex-row flex-wrap items-center gap-2">
                <AccountHeaderBadge>
                  {account.type === 'saving'
                    ? 'Savings Account'
                    : account.type === 'debt'
                      ? isReceivable
                        ? 'Receivable'
                        : 'Payable'
                      : 'Payment Account'}
                </AccountHeaderBadge>
                <AccountHeaderBadge>
                  {account.currency?.name ?? currencyCode}
                </AccountHeaderBadge>
                {account.isArchived ? (
                  <AccountHeaderBadge variant="border">
                    Archived
                  </AccountHeaderBadge>
                ) : null}
              </View>
            </View>
            <DetailsHeaderActions account={account} />
          </View>

          <View className="flex-row items-end justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-foreground text-4xl leading-none font-extrabold tracking-tight">
                {account.type === 'payment' && account.balance < 0 ? '-' : ''}
                {formatCurrency(account.balance, currencyCode)}
              </Text>
              {account.type === 'saving' && account.balance > 0 ? (
                <Icon name="TrendingUp" size={22} className="text-success" />
              ) : null}
              {account.type === 'payment' && account.balance < 0 ? (
                <Icon
                  name="TrendingDown"
                  size={22}
                  className="text-destructive"
                />
              ) : null}
            </View>

            <View className="flex-row gap-2">
              <Button
                size="sm"
                variant="secondary"
                onPress={handleOpenTransfer}
              >
                <Icon
                  name="ArrowLeftRight"
                  size={16}
                  className="text-foreground/80"
                />
                <Text className="ml-1 text-sm">Transfer</Text>
              </Button>
            </View>
          </View>

          {account.description ? (
            <Text className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {account.description}
            </Text>
          ) : null}

          <View className="bg-border/50 mt-4 h-[1px]" />

          <View className="mt-4 flex-row flex-wrap items-center gap-x-6 gap-y-2">
            {account.createdAt ? (
              <MetaRow
                label="Created"
                value={account.createdAt.toLocaleDateString()}
              />
            ) : null}
            <MetaRow label="Currency" value={currencyCode} />
            {account.type === 'saving' && account.savingsTargetAmount ? (
              <MetaRow
                label="Target"
                value={formatCurrency(
                  account.savingsTargetAmount,
                  currencyCode
                )}
              />
            ) : null}
            {account.type === 'saving' && account.savingsTargetDate ? (
              <MetaRow
                label="Target date"
                value={account.savingsTargetDate.toLocaleDateString()}
              />
            ) : null}
            {account.type === 'debt' && account.debtInitialAmount ? (
              <MetaRow
                label="Initial amount"
                value={formatCurrency(account.debtInitialAmount, currencyCode)}
              />
            ) : null}
            {account.type === 'debt' && account.debtDueDate ? (
              <MetaRow
                label="Due date"
                value={account.debtDueDate.toLocaleDateString()}
              />
            ) : null}
          </View>
        </CardContent>
      </LinearGradient>
    </Card>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center">
      <Text className="text-muted-foreground text-xs">{label}</Text>
      <Text className={cn('text-foreground ml-2 text-xs font-medium')}>
        {value}
      </Text>
    </View>
  )
}
