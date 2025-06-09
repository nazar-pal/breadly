import AccountOperationCard from '@/components/accounts/AccountOperationCard'
import EditAccountModal from '@/components/accounts/EditAccountModal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { mockAccounts } from '@/data/mockAccounts'
import { mockAccountOperations } from '@/data/mockData'
import { useAccountManagement } from '@/hooks/useAccountManagement'
import { useLocalSearchParams } from 'expo-router'
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
} from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
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
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <Text
          className="mt-10 text-center text-lg"
          style={{ color: colors.error }}
        >
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
        return colors.primary
      case 'savings':
        return colors.success
      case 'debt':
        return colors.error
      default:
        return colors.primary
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
  const progress = getProgressPercentage()

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
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
          <View className="mb-3 flex-row items-center">
            <View
              className="mr-3 h-12 w-12 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  account.type === 'savings'
                    ? colors.iconBackground.success
                    : account.type === 'debt'
                      ? colors.iconBackground.error
                      : colors.iconBackground.primary
              }}
            >
              <Icon size={24} color={typeColor} />
            </View>
            <View className="flex-1">
              <Text
                className="mb-0.5 text-xl font-bold"
                style={{ color: colors.text }}
              >
                {account.name}
              </Text>
              <Text
                className="text-sm capitalize"
                style={{ color: colors.textSecondary }}
              >
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}{' '}
                Account
              </Text>
            </View>
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleEditAccount(account)}
              leftIcon={<Edit2 size={16} color={colors.text} />}
            >
              Edit
            </Button>
          </View>

          <Text
            className="mb-4 text-sm leading-5"
            style={{ color: colors.textSecondary }}
          >
            {account.description}
          </Text>

          {/* Balance Section */}
          <View className="mb-4">
            <Text
              className="mb-1 text-sm"
              style={{ color: colors.textSecondary }}
            >
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
                <TrendingUp size={20} color={colors.success} />
              )}
              {account.balance < 0 && account.type === 'payment' && (
                <TrendingDown size={20} color={colors.error} />
              )}
            </View>
          </View>

          {/* Progress Section */}
          {progress !== null && (
            <View className="mb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {account.type === 'savings'
                    ? 'Savings Progress'
                    : 'Repayment Progress'}
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {progress.toFixed(1)}%
                </Text>
              </View>
              <View
                className="h-1.5 overflow-hidden rounded-sm"
                style={{ backgroundColor: colors.borderLight }}
              >
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
                <Target size={16} color={colors.textSecondary} />
                <Text
                  className="flex-1 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  Target Amount
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {formatBalance(account.targetAmount)}
                </Text>
              </View>
            )}
            {account.type === 'debt' && account.dueDate && (
              <View className="flex-row items-center gap-2">
                <Calendar size={16} color={colors.textSecondary} />
                <Text
                  className="flex-1 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  Due Date
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {new Date(account.dueDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            {account.type === 'debt' && account.interestRate && (
              <View className="flex-row items-center gap-2">
                <DollarSign size={16} color={colors.textSecondary} />
                <Text
                  className="flex-1 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  Interest Rate
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {account.interestRate}%
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Recent Operations */}
        <View className="mb-5">
          <Text
            className="mb-4 text-xl font-bold tracking-tight"
            style={{ color: colors.text }}
          >
            Recent Activity
          </Text>
          {accountOperations.length > 0 ? (
            accountOperations.map(operation => (
              <AccountOperationCard key={operation.id} operation={operation} />
            ))
          ) : (
            <Card>
              <Text
                className="text-center text-sm italic"
                style={{ color: colors.textSecondary }}
              >
                No recent activity for this account
              </Text>
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
