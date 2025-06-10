import { Progress } from '@/components/ui/progress'
import { CreditCard, DollarSign, PiggyBank, TrendingDown } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

interface AccountCardProps {
  account: {
    id: string
    name: string
    description: string
    balance: number
    type: 'payment' | 'savings' | 'debt'
    currency: string
    targetAmount?: number
    initialAmount?: number
    dueDate?: string
    interestRate?: number
    institution?: string
    person?: string
    debtType?: 'owed' | 'owedTo'
  }
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
  savings: {
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

  const getProgressPercentage = () => {
    if (account.type === 'savings' && account.targetAmount) {
      return (account.balance / account.targetAmount) * 100
    }
    if (account.type === 'debt' && account.initialAmount) {
      return (
        ((account.initialAmount - account.balance) / account.initialAmount) *
        100
      )
    }
    if (account.type === 'payment') {
      // For payment accounts, show percentage of positive balance
      const maxBalance = Math.max(account.balance, 0)
      const threshold = 1000 // Example threshold, adjust as needed
      return Math.min((maxBalance / threshold) * 100, 100)
    }
    return null
  }

  const progress = getProgressPercentage()

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Math.abs(amount))
  }

  const getSecondaryInfo = () => {
    if (account.type === 'savings' && account.targetAmount) {
      return {
        icon: DollarSign,
        text: formatBalance(account.targetAmount),
        label: 'Target'
      }
    }
    if (account.type === 'debt' && account.dueDate) {
      return {
        icon: DollarSign,
        text: new Date(account.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        label: 'Due'
      }
    }
    if (account.type === 'payment' && account.institution) {
      return {
        icon: DollarSign,
        text: account.institution,
        label: 'Institution'
      }
    }
    return null
  }

  const secondaryInfo = getSecondaryInfo()
  const isNegativePayment = account.balance < 0 && account.type === 'payment'
  const isPositiveSavings = account.balance > 0 && account.type === 'savings'

  return (
    <Pressable
      className={cn(
        'mb-2 w-full rounded-xl p-3 shadow-sm shadow-slate-500/50',
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
            className="text-foreground mb-px text-base font-semibold"
            numberOfLines={1}
          >
            {account.name}
          </Text>
          <Text className="text-foreground text-xs capitalize">
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Text>
        </View>
        <View className="flex-row items-center">
          {isNegativePayment && (
            <TrendingDown size={12} className="text-account-debt mr-0.5" />
          )}
          {isPositiveSavings && (
            <TrendingDown size={12} className="text-account-savings mr-0.5" />
          )}
          <Text
            className={cn(
              'text-base font-bold',
              account.type === 'debt'
                ? account.debtType === 'owed'
                  ? 'text-account-debt'
                  : 'text-account-savings'
                : account.balance >= 0
                  ? 'text-foreground'
                  : 'text-account-debt'
            )}
          >
            {formatBalance(account.balance)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {progress !== null && (
        <View className="mb-1.5">
          <Progress
            value={progress}
            className="bg-muted h-1"
            indicatorClassName={config.progressClass}
          />
        </View>
      )}

      {/* Footer with secondary info */}
      {secondaryInfo && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <secondaryInfo.icon size={10} className="text-muted-foreground" />
            <Text className="text-foreground ml-1 text-[11px]">
              {secondaryInfo.label}
            </Text>
          </View>
          <Text className="text-foreground text-[11px] font-medium">
            {secondaryInfo.text}
          </Text>
        </View>
      )}
    </Pressable>
  )
}
