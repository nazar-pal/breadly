import AccountTransactionItem from '@/components/accounts/AccountTransactionItem'
import EditAccountModal from '@/components/accounts/EditAccountModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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

  // Find the account
  const allAccounts = [
    ...mockAccounts.payment,
    ...mockAccounts.savings,
    ...mockAccounts.debt
  ]
  const account = allAccounts.find(acc => acc.id === id)

  // Get account operations
  const accountOperations = mockAccountOperations
    .filter(op => op.accountId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10) // Show last 10 operations

  if (!account) {
    return (
      <View className="bg-background flex-1">
        <Text className="text-destructive mt-10 text-center text-lg">
          Account not found
        </Text>
      </View>
    )
  }

  const getAccountIcon = () => {
    switch (account.type) {
      case 'payment':
        return account.name.toLowerCase().includes('credit')
          ? CreditCard
          : Wallet
      case 'savings':
        return PiggyBank
      case 'debt':
        return DollarSign
      default:
        return Wallet
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
      case 'savings':
        return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
      case 'debt':
        return 'rgba(239, 68, 68, 0.1)' // colors.iconBackground.error
      default:
        return 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
    }
  }

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount))
  }

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

  const Icon = getAccountIcon()
  const typeColor = getTypeColor()
  const iconBgColor = getIconBackgroundColor()
  const progress = getProgressPercentage()

  return (
    <View className="bg-background flex-1">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 20
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Header Card */}
        <Card
          className="mb-6 border-l-4"
          style={{ borderLeftColor: typeColor }}
        >
          <CardContent>
            <View className="mb-3 flex-row items-center">
              <View
                className="mr-3 h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: iconBgColor }}
              >
                <Icon size={24} color={typeColor} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground mb-0.5 text-xl font-bold">
                  {account.name}
                </Text>
                <Text className="text-foreground text-sm capitalize">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}{' '}
                  Account
                </Text>
              </View>
              <Button
                variant="outline"
                size="sm"
                onPress={() => handleEditAccount(account)}
              >
                <Edit2 size={16} color="#1A202C" style={{ marginRight: 8 }} />
                <Text>Edit</Text>
              </Button>
            </View>

            <Text className="text-foreground mb-4 text-sm leading-5">
              {account.description}
            </Text>

            {/* Balance Section */}
            <View className="mb-4">
              <Text className="text-foreground mb-1 text-sm">
                Current Balance
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-[32px] font-extrabold"
                  style={{ color: typeColor }}
                >
                  {account.balance < 0 && account.type === 'payment' ? '-' : ''}
                  {formatBalance(account.balance)}
                </Text>
                {account.balance > 0 && account.type === 'savings' && (
                  <TrendingUp size={20} color="#10B981" />
                )}
                {account.balance < 0 && account.type === 'payment' && (
                  <TrendingDown size={20} color="#EF4444" />
                )}
              </View>
            </View>

            {/* Progress Section */}
            {progress !== null && (
              <View className="mb-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-foreground text-sm">
                    {account.type === 'savings'
                      ? 'Savings Progress'
                      : 'Repayment Progress'}
                  </Text>
                  <Text className="text-foreground text-sm font-semibold">
                    {progress.toFixed(1)}%
                  </Text>
                </View>
                <View className="bg-border-light h-1.5 overflow-hidden rounded-sm">
                  <View
                    className="h-full"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: typeColor
                    }}
                  />
                </View>
              </View>
            )}

            {/* Additional Info */}
            <View className="gap-3">
              {account.type === 'savings' && account.targetAmount && (
                <View className="flex-row items-center gap-2">
                  <Target size={16} color="#4A5568" />
                  <Text className="text-foreground flex-1 text-sm">
                    Target Amount
                  </Text>
                  <Text className="text-foreground text-sm font-semibold">
                    {formatBalance(account.targetAmount)}
                  </Text>
                </View>
              )}
              {account.type === 'debt' && account.dueDate && (
                <View className="flex-row items-center gap-2">
                  <Calendar size={16} color="#4A5568" />
                  <Text className="text-foreground flex-1 text-sm">
                    Due Date
                  </Text>
                  <Text className="text-foreground text-sm font-semibold">
                    {new Date(account.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
              {account.type === 'debt' && account.interestRate && (
                <View className="flex-row items-center gap-2">
                  <DollarSign size={16} color="#4A5568" />
                  <Text className="text-foreground flex-1 text-sm">
                    Interest Rate
                  </Text>
                  <Text className="text-foreground text-sm font-semibold">
                    {account.interestRate}%
                  </Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Recent Operations */}
        <View className="mb-5">
          <Text className="text-foreground mb-4 text-xl font-bold tracking-tight">
            Recent Activity
          </Text>
          {accountOperations.length > 0 ? (
            accountOperations.map(operation => (
              <AccountTransactionItem
                key={operation.id}
                operation={operation}
              />
            ))
          ) : (
            <Card>
              <CardContent>
                <Text className="text-foreground text-center text-sm italic">
                  No recent activity for this account
                </Text>
              </CardContent>
            </Card>
          )}
        </View>
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
