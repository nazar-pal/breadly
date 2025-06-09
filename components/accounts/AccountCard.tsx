import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import { useRouter } from 'expo-router'
import {
  Banknote as BanknoteIcon,
  Calendar,
  CreditCard,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react-native'
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
  const { colors } = useTheme()
  const router = useRouter()

  const styles = useThemedStyles(theme => ({
    container: {
      backgroundColor: theme.colors.card,
      borderLeftWidth: 3,
      ...Platform.select({
        android: {
          elevation: 1
        },
        default: {
          boxShadow: `0px 1px 3px ${theme.colors.shadowLight}`
        }
      })
    }
  }))

  const handlePress = () => {
    router.push(`/accounts/${account.id}` as any)
  }

  const getIcon = () => {
    switch (account.type) {
      case 'payment':
        return account.name.toLowerCase().includes('credit')
          ? CreditCard
          : Wallet
      case 'savings':
        return PiggyBank
      case 'debt':
        return BanknoteIcon
      default:
        return Wallet
    }
  }

  const getTypeColor = () => {
    switch (account.type) {
      case 'payment':
        return colors.primary
      case 'savings':
        return colors.success
      case 'debt':
        return colors.error
      default:
        return colors.primary
    }
  }

  const Icon = getIcon()
  const typeColor = getTypeColor()

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
      return account.debtType === 'owed' ? colors.error : colors.success
    }
    return account.balance >= 0 ? colors.text : colors.error
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
        icon: Target,
        text: formatBalance(account.targetAmount),
        label: 'Target'
      }
    }
    if (account.type === 'debt' && account.dueDate) {
      return {
        icon: Calendar,
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
      style={[
        styles.container,
        {
          borderLeftColor: typeColor
        }
      ]}
      onPress={handlePress}
    >
      {/* Header Row */}
      <View className="mb-2 flex-row items-start">
        <View
          className="mr-3 h-7 w-7 items-center justify-center rounded-md"
          style={{
            backgroundColor:
              colors.iconBackground[
                account.type === 'payment'
                  ? 'primary'
                  : account.type === 'savings'
                    ? 'success'
                    : 'error'
              ]
          }}
        >
          <Icon size={16} color={typeColor} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className="mb-px text-base font-semibold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {account.name}
          </Text>
          <Text
            className="text-xs capitalize"
            style={{ color: colors.textSecondary }}
          >
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Text>
        </View>
        <View className="flex-row items-center">
          {account.balance < 0 && account.type === 'payment' && (
            <TrendingDown
              size={12}
              color={colors.error}
              style={{ marginRight: 2 }}
            />
          )}
          {account.balance > 0 && account.type === 'savings' && (
            <TrendingUp
              size={12}
              color={colors.success}
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
          <View
            className="mr-2 h-0.5 flex-1 overflow-hidden rounded-sm"
            style={{ backgroundColor: colors.surfaceSecondary }}
          >
            <View
              className="h-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: typeColor
              }}
            />
          </View>
          <Text
            className="min-w-[30px] text-right text-[10px] font-medium"
            style={{ color: colors.textSecondary }}
          >
            {progress.toFixed(0)}%
          </Text>
        </View>
      )}

      {/* Footer with secondary info */}
      {secondaryInfo && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <secondaryInfo.icon size={10} color={colors.textSecondary} />
            <Text
              className="ml-1 text-[11px]"
              style={{ color: colors.textSecondary }}
            >
              {secondaryInfo.label}
            </Text>
          </View>
          <Text
            className="text-[11px] font-medium"
            style={{ color: colors.textSecondary }}
          >
            {secondaryInfo.text}
          </Text>
        </View>
      )}
    </Pressable>
  )
}
