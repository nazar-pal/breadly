import { Icon, IconName } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { AccountType } from '@/data/client/db-schema'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { cn, getCurrencyInfo } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'
import { DetailsHeaderActions } from './account-header-actions'
import { AccountHeaderBadge } from './account-header-badge'

interface AccountVisualStyle {
  colorClass: string
  bgColorClass: string
  icon: IconName
  label: string
}

const variants: Record<AccountType, AccountVisualStyle> = {
  payment: {
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    icon: 'Wallet',
    label: 'Payment Account'
  },
  saving: {
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10',
    icon: 'PiggyBank',
    label: 'Savings Account'
  },
  debt: {
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/10',
    icon: 'DollarSign',
    label: 'Debt Account'
  }
}

export function AccountHeader({ account }: { account: GetAccountResultItem }) {
  const v = variants[account.type]
  const isDebt = account.type === 'debt'
  // Positive balance = someone owes you (receivable)
  // Negative balance = you owe someone (payable)
  const isReceivable = isDebt && account.balance > 0

  const currencyLabel = getCurrencyInfo(account.currency.code)?.currency

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View
          className={cn(
            'mr-3 h-14 w-14 items-center justify-center rounded-2xl',
            isReceivable ? 'bg-emerald-500/10' : v.bgColorClass
          )}
        >
          <Icon
            name={v.icon}
            size={28}
            className={cn(isReceivable ? 'text-emerald-600' : v.colorClass)}
          />
        </View>
        <View>
          <Text className="text-foreground text-2xl font-bold">
            {account.name}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <AccountHeaderBadge>
              {isDebt ? (isReceivable ? 'Receivable' : 'Payable') : v.label}
            </AccountHeaderBadge>
            <AccountHeaderBadge>{currencyLabel}</AccountHeaderBadge>
            {account.isArchived ? (
              <AccountHeaderBadge variant="border">Archived</AccountHeaderBadge>
            ) : null}
          </View>
        </View>
      </View>
      <DetailsHeaderActions account={account} />
    </View>
  )
}
