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
      width: '100%' as const,
      padding: 12,
      borderRadius: 12,
      borderLeftWidth: 3,
      marginBottom: 8,
      ...Platform.select({
        android: {
          elevation: 1
        },
        default: {
          boxShadow: `0px 1px 3px ${theme.colors.shadowLight}`
        }
      })
    } as const,
    header: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 8
    },
    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 6,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12
    },
    headerText: {
      flex: 1,
      minWidth: 0 // Ensures text truncation works
    },
    name: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: 1
    },
    type: {
      fontSize: 12,
      textTransform: 'capitalize' as const
    },
    balanceContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const
    },
    trendIcon: {
      marginRight: 2
    },
    balance: {
      fontSize: 16,
      fontWeight: '700' as const
    },
    progressSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 6
    },
    progressContainer: {
      flex: 1,
      height: 3,
      borderRadius: 1.5,
      overflow: 'hidden' as const,
      marginRight: 8
    },
    progressBar: {
      height: '100%' as const
    },
    progressText: {
      fontSize: 10,
      fontWeight: '500' as const,
      minWidth: 30,
      textAlign: 'right' as const
    },
    footer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const
    },
    secondaryInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const
    },
    secondaryLabel: {
      fontSize: 11,
      marginLeft: 3
    },
    secondaryValue: {
      fontSize: 11,
      fontWeight: '500' as const
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
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderLeftColor: typeColor
        }
      ]}
      onPress={handlePress}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                colors.iconBackground[
                  account.type === 'payment'
                    ? 'primary'
                    : account.type === 'savings'
                      ? 'success'
                      : 'error'
                ]
            }
          ]}
        >
          <Icon size={16} color={typeColor} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {account.name}
          </Text>
          <Text style={[styles.type, { color: colors.textSecondary }]}>
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          {account.balance < 0 && account.type === 'payment' && (
            <TrendingDown
              size={12}
              color={colors.error}
              style={styles.trendIcon}
            />
          )}
          {account.balance > 0 && account.type === 'savings' && (
            <TrendingUp
              size={12}
              color={colors.success}
              style={styles.trendIcon}
            />
          )}
          <Text style={[styles.balance, { color: getBalanceColor() }]}>
            {formatBalance(account.balance)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {progress !== null && (
        <View style={styles.progressSection}>
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: colors.surfaceSecondary }
            ]}
          >
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: typeColor
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {progress.toFixed(0)}%
          </Text>
        </View>
      )}

      {/* Footer with secondary info */}
      {secondaryInfo && (
        <View style={styles.footer}>
          <View style={styles.secondaryInfo}>
            <secondaryInfo.icon size={10} color={colors.textSecondary} />
            <Text
              style={[styles.secondaryLabel, { color: colors.textSecondary }]}
            >
              {secondaryInfo.label}
            </Text>
          </View>
          <Text
            style={[styles.secondaryValue, { color: colors.textSecondary }]}
          >
            {secondaryInfo.text}
          </Text>
        </View>
      )}
    </Pressable>
  )
}
