import { CreditCard, DollarSign, PiggyBank, TrendingDown } from '@/lib/icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

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

export default function AccountCard({ account, onPress }: AccountCardProps) {
  const router = useRouter()

  const getCardStyle = () => {
    return {
      backgroundColor: '#FFFFFF', // colors.card
      borderLeftWidth: 3,
      borderLeftColor: getTypeColor(),
      ...Platform.select({
        android: {
          elevation: 1
        },
        default: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)' // colors.shadowLight
        }
      })
    }
  }

  const handlePress = () => {
    router.push(`/accounts/${account.id}` as any)
  }

  const getIcon = () => {
    switch (account.type) {
      case 'payment':
        return account.name.toLowerCase().includes('credit')
          ? CreditCard
          : DollarSign
      case 'savings':
        return PiggyBank
      case 'debt':
        return DollarSign
      default:
        return DollarSign
    }
  }

  const getTypeColor = () => {
    switch (account.type) {
      case 'payment':
        return '#6366F1' // colors.primary
      case 'savings':
        return '#10B981' // colors.success
      case 'debt':
        return '#EF4444' // colors.error
      default:
        return '#6366F1' // colors.primary
    }
  }

  const getIconBackgroundColor = () => {
    switch (account.type) {
      case 'payment':
        return 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
      case 'savings':
        return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
      case 'debt':
        return 'rgba(239, 68, 68, 0.1)' // colors.iconBackground.error
      default:
        return 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
    }
  }

  const Icon = getIcon()
  const typeColor = getTypeColor()
  const iconBgColor = getIconBackgroundColor()

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
    return null
  }

  const progress = getProgressPercentage()

  const getBalanceColor = () => {
    if (account.type === 'debt') {
      return account.debtType === 'owed' ? '#EF4444' : '#10B981' // colors.error : colors.success
    }
    return account.balance >= 0 ? '#1A202C' : '#EF4444' // colors.text : colors.error
  }

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
    return null
  }

  const secondaryInfo = getSecondaryInfo()

  return (
    <Pressable
      className="mb-2 w-full rounded-xl p-3"
      style={getCardStyle()}
      onPress={handlePress}
    >
      {/* Header Row */}
      <View className="mb-2 flex-row items-start">
        <View
          className="mr-3 h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={16} color={typeColor} />
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
          {account.balance < 0 && account.type === 'payment' && (
            <TrendingDown
              size={12}
              color="#EF4444" // colors.error
              style={{ marginRight: 2 }}
            />
          )}
          {account.balance > 0 && account.type === 'savings' && (
            <TrendingDown
              size={12}
              color="#10B981" // colors.success
              style={{ marginRight: 2 }}
            />
          )}
          <Text
            className="text-base font-bold"
            style={{ color: getBalanceColor() }}
          >
            {formatBalance(account.balance)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {progress !== null && (
        <View className="mb-1.5 flex-row items-center">
          <View className="bg-card-secondary mr-2 h-0.5 flex-1 overflow-hidden rounded-sm">
            <View
              className="h-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: typeColor
              }}
            />
          </View>
          <Text className="text-foreground min-w-[30px] text-right text-[10px] font-medium">
            {progress.toFixed(0)}%
          </Text>
        </View>
      )}

      {/* Footer with secondary info */}
      {secondaryInfo && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <secondaryInfo.icon size={10} color="#4A5568" />
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
