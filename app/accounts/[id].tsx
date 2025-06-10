import AccountTransactionItem from '@/components/accounts/AccountTransactionItem'
import EditAccountModal from '@/components/accounts/EditAccountModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { mockAccounts } from '@/data/mockAccounts'
import { mockAccountOperations } from '@/data/mockData'
import { useAccountManagement } from '@/hooks/useAccountManagement'
import {
  Calendar,
  CreditCard,
  DollarSign,
  Edit2,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet
} from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface AccountTypeConfig {
  colorClass: string
  bgColorClass: string
  icon: typeof Wallet
  label: string
}

const ACCOUNT_TYPES: Record<string, AccountTypeConfig> = {
  payment: {
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    icon: Wallet,
    label: 'Payment Account'
  },
  credit: {
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    icon: CreditCard,
    label: 'Credit Card'
  },
  savings: {
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10',
    icon: PiggyBank,
    label: 'Savings Account'
  },
  debt: {
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/10',
    icon: DollarSign,
    label: 'Debt Account'
  }
}

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <View className="flex-row items-center gap-2 py-2">
      {icon}
      <Text className="text-muted-foreground flex-1 text-sm">{label}</Text>
      <Text className="text-foreground text-sm font-semibold">{value}</Text>
    </View>
  )
}

interface AccountHeaderProps {
  name: string
  type: string
  icon: typeof Wallet
  colorClass: string
  bgColorClass: string
  onEdit: () => void
}

function AccountHeader({
  name,
  type,
  icon: Icon,
  colorClass,
  bgColorClass,
  onEdit
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
          <Icon size={28} className={colorClass} />
        </View>
        <View>
          <Text className="text-foreground text-2xl font-bold">{name}</Text>
          <Text className="text-muted-foreground text-base">{type}</Text>
        </View>
      </View>
      <Pressable
        onPress={onEdit}
        className={cn(
          'h-9 w-9 items-center justify-center rounded-full',
          'bg-background/80',
          'active:bg-muted',
          'border-border/30 border'
        )}
      >
        <Edit2 size={16} className="text-muted-foreground" />
      </Pressable>
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
    <Card className="bg-card/50 mb-4 border-0 shadow-none">
      <CardContent className="py-6">
        <Text className="text-muted-foreground mb-2 text-sm">
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
          {balance > 0 && type === 'savings' && (
            <TrendingUp size={24} className="text-success" />
          )}
          {balance < 0 && type === 'payment' && (
            <TrendingDown size={24} className="text-destructive" />
          )}
        </View>
        {description && (
          <Text className="text-muted-foreground mt-4 text-sm leading-relaxed">
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
    <Card className="bg-card/50 mb-4 border-0 shadow-none">
      <CardContent className="py-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-foreground text-base font-medium">
            {type === 'savings' ? 'Savings Progress' : 'Repayment Progress'}
          </Text>
          <Text className={cn('text-2xl font-bold', colorClass)}>
            {progress.toFixed(1)}%
          </Text>
        </View>
        <View className="bg-secondary h-2 overflow-hidden rounded-full">
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

interface DetailsCardProps {
  account: any
  formatBalance: (amount: number) => string
}

function DetailsCard({ account, formatBalance }: DetailsCardProps) {
  if (
    !(account.type === 'savings' && account.targetAmount) &&
    !(account.type === 'debt' && (account.dueDate || account.interestRate))
  ) {
    return null
  }

  return (
    <Card className="bg-card/50 mb-4 border-0 shadow-none">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        {account.type === 'savings' && account.targetAmount && (
          <InfoItem
            icon={<Target size={18} className="text-muted-foreground" />}
            label="Target Amount"
            value={formatBalance(account.targetAmount)}
          />
        )}
        {account.type === 'debt' && account.dueDate && (
          <InfoItem
            icon={<Calendar size={18} className="text-muted-foreground" />}
            label="Due Date"
            value={new Date(account.dueDate).toLocaleDateString()}
          />
        )}
        {account.type === 'debt' && account.interestRate && (
          <InfoItem
            icon={<DollarSign size={18} className="text-muted-foreground" />}
            label="Interest Rate"
            value={`${account.interestRate}%`}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface ActivitySectionProps {
  operations: typeof mockAccountOperations
}

function ActivitySection({ operations }: ActivitySectionProps) {
  return (
    <View className="mt-8">
      <View className="mb-4">
        <Text className="text-foreground text-xl font-semibold">
          Recent Activity
        </Text>
      </View>
      <View>
        {operations.length > 0 ? (
          operations.map(operation => (
            <AccountTransactionItem key={operation.id} operation={operation} />
          ))
        ) : (
          <View className="py-8">
            <Text className="text-muted-foreground text-center text-sm">
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
  const insets = useSafeAreaInsets()
  const {
    editModalVisible,
    selectedAccount,
    handleEditAccount,
    handleSaveAccount,
    handleCloseModal
  } = useAccountManagement()

  const allAccounts = [
    ...mockAccounts.payment,
    ...mockAccounts.savings,
    ...mockAccounts.debt
  ]
  const account = allAccounts.find(acc => acc.id === id)

  const accountOperations = mockAccountOperations
    .filter(op => op.accountId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  if (!account) {
    return (
      <View className="bg-background flex-1">
        <Text className="text-destructive mt-10 text-center text-lg">
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

  let progress = null
  if (account.type === 'savings' && account.targetAmount) {
    progress = (account.balance / account.targetAmount) * 100
  } else if (account.type === 'debt' && account.initialAmount) {
    progress =
      ((account.initialAmount - account.balance) / account.initialAmount) * 100
  }

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount))
  }

  return (
    <View className="bg-background flex-1">
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
          onEdit={() => handleEditAccount(account)}
        />

        <BalanceCard
          balance={account.balance}
          colorClass={colorClass}
          type={account.type}
          description={account.description}
          currency={account.currency}
        />

        {progress !== null && (
          <ProgressCard
            progress={progress}
            type={account.type}
            colorClass={colorClass}
            bgColorClass={bgColorClass}
          />
        )}

        <DetailsCard account={account} formatBalance={formatBalance} />

        <ActivitySection operations={accountOperations} />
      </ScrollView>

      <EditAccountModal
        visible={editModalVisible}
        account={selectedAccount}
        onSave={handleSaveAccount}
        onClose={handleCloseModal}
      />
    </View>
  )
}
