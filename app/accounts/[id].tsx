import { AccountTransactionItem } from '@/components/account-details/account-transaction-item'
import { Icon, type IconName } from '@/components/icon'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { deleteAccount } from '@/data/client/mutations'
import { useGetAccount } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface AccountTypeConfig {
  colorClass: string
  bgColorClass: string
  icon: IconName
  label: string
}

const ACCOUNT_TYPES: Record<string, AccountTypeConfig> = {
  payment: {
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    icon: 'Wallet',
    label: 'Payment Account'
  },
  credit: {
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    icon: 'CreditCard',
    label: 'Credit Card'
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

interface AccountHeaderProps {
  name: string
  type: string
  icon: IconName
  colorClass: string
  bgColorClass: string
  onEdit: () => void
  onDelete: () => void
}

function AccountHeader({
  name,
  type,
  icon,
  colorClass,
  bgColorClass,
  onEdit,
  onDelete
}: AccountHeaderProps) {
  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View
          className={cn(
            'mr-3 h-14 w-14 items-center justify-center rounded-2xl',
            bgColorClass
          )}
        >
          <Icon name={icon} size={28} className={colorClass} />
        </View>
        <View>
          <Text className="text-2xl font-bold text-foreground">{name}</Text>
          <Text className="text-base text-muted-foreground">{type}</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <Pressable
          onPress={onEdit}
          className={cn(
            'h-9 w-9 items-center justify-center rounded-full',
            'bg-background/80',
            'active:bg-muted',
            'border border-border/30'
          )}
        >
          <Icon name="Pencil" size={16} className="text-muted-foreground" />
        </Pressable>
        <Pressable
          onPress={onDelete}
          className={cn(
            'h-9 w-9 items-center justify-center rounded-full',
            'bg-destructive/10',
            'active:bg-destructive/20',
            'border border-destructive/30'
          )}
        >
          <Icon name="Trash" size={16} className="text-destructive" />
        </Pressable>
      </View>
    </View>
  )
}

interface BalanceCardProps {
  balance: number
  colorClass: string
  type: string
  description?: string
  currency: string
}

function BalanceCard({
  balance,
  colorClass,
  type,
  description,
  currency
}: BalanceCardProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount))
  }

  return (
    <Card className="mb-4 border-0 bg-card/50 shadow-none">
      <CardContent className="py-6">
        <Text className="mb-2 text-sm text-muted-foreground">
          Current Balance
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            className={cn(
              'text-[40px] font-extrabold leading-none tracking-tight',
              colorClass
            )}
          >
            {balance < 0 && type === 'payment' ? '-' : ''}
            {formatBalance(balance)}
          </Text>
          {balance > 0 && type === 'saving' && (
            <Icon name="TrendingUp" size={24} className="text-success" />
          )}
          {balance < 0 && type === 'payment' && (
            <Icon name="TrendingDown" size={24} className="text-destructive" />
          )}
        </View>
        {description && (
          <Text className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </Text>
        )}
      </CardContent>
    </Card>
  )
}

interface ProgressCardProps {
  progress: number
  type: string
  colorClass: string
  bgColorClass: string
}

function ProgressCard({
  progress,
  type,
  colorClass,
  bgColorClass
}: ProgressCardProps) {
  return (
    <Card className="mb-4 border-0 bg-card/50 shadow-none">
      <CardContent className="py-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-base font-medium text-foreground">
            {type === 'saving' ? 'Savings Progress' : 'Repayment Progress'}
          </Text>
          <Text className={cn('text-2xl font-bold', colorClass)}>
            {progress.toFixed(1)}%
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-secondary">
          <View
            className={cn('h-full', bgColorClass)}
            style={{
              width: `${Math.min(progress, 100)}%`
            }}
          />
        </View>
      </CardContent>
    </Card>
  )
}

interface ActivitySectionProps {
  operations: any[]
}

function ActivitySection({ operations }: ActivitySectionProps) {
  return (
    <View className="mt-8">
      <View className="mb-4">
        <Text className="text-xl font-semibold text-foreground">
          Recent Activity
        </Text>
      </View>
      <View>
        {operations.length > 0 ? (
          operations.map((operation, index) => (
            <AccountTransactionItem key={index} operation={operation} />
          ))
        ) : (
          <View className="py-8">
            <Text className="text-center text-sm text-muted-foreground">
              No recent activity for this account
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { userId } = useUserSession()
  const { data: accounts, isLoading } = useGetAccount({
    userId,
    accountId: id
  })
  const account = accounts?.[0]

  // For now, we'll use empty array for operations until transactions are implemented
  const accountOperations: any[] = []
  // hasTransactions variable removed as it's not currently used

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-muted-foreground">Loading...</Text>
      </View>
    )
  }

  if (!account) {
    return (
      <View className="flex-1 bg-background">
        <Text className="mt-10 text-center text-lg text-destructive">
          Account not found
        </Text>
      </View>
    )
  }

  const accountType = account.name.toLowerCase().includes('credit')
    ? 'credit'
    : account.type
  const {
    colorClass,
    bgColorClass,
    icon: Icon,
    label
  } = ACCOUNT_TYPES[accountType]

  // Balance is already a number now
  const balanceAmount = account.balance || 0

  let progress = null

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({
        id: account.id,
        userId
      })
      router.back()
    } catch (error) {
      // Error is already handled in the hook with Alert.alert
      console.error('Failed to delete account:', error)
    }
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <AccountHeader
          name={account.name}
          type={label}
          icon={Icon}
          colorClass={colorClass}
          bgColorClass={bgColorClass}
          onEdit={() => console.log('edit')}
          onDelete={() => {
            Alert.alert(
              'Delete Account',
              `Are you sure you want to delete the account "${account.name}"? This action cannot be undone.`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: handleDeleteAccount
                }
              ]
            )
          }}
        />

        <BalanceCard
          balance={balanceAmount}
          colorClass={colorClass}
          type={account.type}
          description={account.description || undefined}
          currency={account.currencyId || 'USD'}
        />

        {progress !== null && (
          <ProgressCard
            progress={progress}
            type={account.type}
            colorClass={colorClass}
            bgColorClass={bgColorClass}
          />
        )}

        <ActivitySection operations={accountOperations} />
      </ScrollView>
    </View>
  )
}
