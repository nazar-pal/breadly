import { Progress } from '@/components/ui/progress'
import { Account } from '@/hooks/useAccounts'
import { CreditCard, DollarSign, PiggyBank, TrendingDown } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

interface AccountCardProps {
  account: Account
  onPress?: () => void
}

interface AccountTypeConfig {
  icon: typeof DollarSign
  colorClass: string
  bgColorClass: string
  borderColorClass: string
  progressClass: string
}

const ACCOUNT_TYPES: Record<string, AccountTypeConfig> = {
  payment: {
    icon: DollarSign,
    colorClass: 'text-account-payment',
    bgColorClass: 'bg-account-payment/10',
    borderColorClass: 'border-l-account-payment',
    progressClass: 'bg-account-payment'
  },
  credit: {
    icon: CreditCard,
    colorClass: 'text-account-payment',
    bgColorClass: 'bg-account-payment/10',
    borderColorClass: 'border-l-account-payment',
    progressClass: 'bg-account-payment'
  },
  saving: {
    icon: PiggyBank,
    colorClass: 'text-account-savings',
    bgColorClass: 'bg-account-savings/10',
    borderColorClass: 'border-l-account-savings',
    progressClass: 'bg-account-savings'
  },
  debt: {
    icon: DollarSign,
    colorClass: 'text-account-debt',
    bgColorClass: 'bg-account-debt/10',
    borderColorClass: 'border-l-account-debt',
    progressClass: 'bg-account-debt'
  }
}

export default function AccountCard({ account, onPress }: AccountCardProps) {
  const router = useRouter()

  const handlePress = () => {
    router.push(`/accounts/${account.id}` as any)
  }

  const getAccountConfig = () => {
    if (
      account.type === 'payment' &&
      account.name.toLowerCase().includes('credit')
    ) {
      return ACCOUNT_TYPES.credit
    }
    return ACCOUNT_TYPES[account.type]
  }

  const config = getAccountConfig()
  const Icon = config.icon

  // Convert balance from string to number
  const balanceAmount = parseFloat(account.balance) || 0

  const formatBalance = (amount: number) => {
    const currency = account.currency?.code || 'USD'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Math.abs(amount))
  }

  const getProgressPercentage = () => {
    if (account.type === 'saving' && account.savingsTargetAmount) {
      // For savings: current balance / target amount * 100
      const targetAmount = parseFloat(account.savingsTargetAmount) || 0
      if (targetAmount > 0) {
        return Math.min((balanceAmount / targetAmount) * 100, 100)
      }
    }

    if (account.type === 'debt' && account.debtInitialAmount) {
      // For debt: (initial amount - current balance) / initial amount * 100
      // This shows how much of the debt has been paid off
      const initialAmount = parseFloat(account.debtInitialAmount) || 0
      if (initialAmount > 0) {
        const paidAmount = initialAmount - balanceAmount
        return Math.min(Math.max((paidAmount / initialAmount) * 100, 0), 100)
      }
    }

    return null
  }

  const progress = getProgressPercentage()

  const getProgressLabel = () => {
    if (
      account.type === 'saving' &&
      account.savingsTargetAmount &&
      progress !== null
    ) {
      const targetAmount = parseFloat(account.savingsTargetAmount) || 0
      return `${formatBalance(balanceAmount)} of ${formatBalance(targetAmount)} saved`
    }

    if (
      account.type === 'debt' &&
      account.debtInitialAmount &&
      progress !== null
    ) {
      const initialAmount = parseFloat(account.debtInitialAmount) || 0
      const paidAmount = initialAmount - balanceAmount
      return `${formatBalance(paidAmount)} of ${formatBalance(initialAmount)} paid`
    }

    return null
  }

  const progressLabel = getProgressLabel()

  const isNegativePayment = balanceAmount < 0 && account.type === 'payment'
  const isPositiveSaving = balanceAmount > 0 && account.type === 'saving'

  return (
    <Pressable
      className={cn(
        'mb-2 w-full rounded-xl bg-card p-3 shadow-sm shadow-slate-500/50',
        'border-l-[3px]',
        config.borderColorClass
      )}
      onPress={handlePress}
    >
      {/* Header Row */}
      <View className="mb-2 flex-row items-start">
        <View
          className={cn(
            'mr-3 h-7 w-7 items-center justify-center rounded-md',
            config.bgColorClass
          )}
        >
          <Icon size={16} className={config.colorClass} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className="mb-px text-base font-semibold text-foreground"
            numberOfLines={1}
          >
            {account.name}
          </Text>
          <Text className="text-xs capitalize text-muted-foreground">
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Text>
        </View>
        <View className="flex-row items-center">
          {isNegativePayment && (
            <TrendingDown size={12} className="mr-0.5 text-account-debt" />
          )}
          {isPositiveSaving && (
            <TrendingDown size={12} className="mr-0.5 text-account-savings" />
          )}
          <Text
            className={cn(
              'text-base font-bold',
              account.type === 'debt'
                ? 'text-account-debt'
                : balanceAmount >= 0
                  ? 'text-foreground'
                  : 'text-account-debt'
            )}
          >
            {formatBalance(balanceAmount)}
          </Text>
        </View>
      </View>

      {/* Description */}
      {account.description && (
        <View className="mb-2">
          <Text className="text-sm text-muted-foreground" numberOfLines={2}>
            {account.description}
          </Text>
        </View>
      )}

      {/* Progress Bar */}
      {progress !== null && (
        <View className="mt-2">
          {progressLabel && (
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {progressLabel}
              </Text>
              <Text className={cn('text-xs font-semibold', config.colorClass)}>
                {progress.toFixed(0)}%
              </Text>
            </View>
          )}
          <Progress
            value={progress}
            className="h-1.5 w-full"
            indicatorClassName={config.progressClass}
          />
        </View>
      )}
    </Pressable>
  )
}
