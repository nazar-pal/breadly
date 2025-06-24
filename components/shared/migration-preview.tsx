import { useUserSession } from '@/lib/context/user-context'
import { useMigrationPreview } from '@/lib/hooks'
import { ActivityIndicator, Text, View } from 'react-native'

/**
 * Example component showing how to use the useMigrationPreview hook
 * Only renders for guest users and shows their data that will be preserved
 */
export function MigrationPreview() {
  const { isGuest } = useUserSession()
  const { stats, isLoading, error } = useMigrationPreview()

  // Only show for guest users
  if (!isGuest) {
    return null
  }

  if (isLoading) {
    return (
      <View className="items-center justify-center p-4">
        <ActivityIndicator size="small" />
        <Text className="mt-2 text-sm text-muted-foreground">
          Checking your data...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="p-4">
        <Text className="text-sm text-destructive">
          Unable to check your data
        </Text>
      </View>
    )
  }

  if (!stats || stats.total === 0) {
    return (
      <View className="p-4">
        <Text className="text-sm text-muted-foreground">
          No data to preserve yet. Start using the app to create your first
          transactions!
        </Text>
      </View>
    )
  }

  return (
    <View className="rounded-lg bg-primary/5 p-4">
      <Text className="mb-2 font-semibold text-foreground">
        Your data will be preserved! 🎉
      </Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        You have {stats.total} items that will be saved to your account:
      </Text>

      <View className="space-y-1">
        {stats.transactions > 0 && (
          <Text className="text-sm text-muted-foreground">
            • {stats.transactions} transactions
          </Text>
        )}
        {stats.accounts > 0 && (
          <Text className="text-sm text-muted-foreground">
            • {stats.accounts} accounts
          </Text>
        )}
        {stats.categories > 0 && (
          <Text className="text-sm text-muted-foreground">
            • {stats.categories} categories
          </Text>
        )}
        {stats.budgets > 0 && (
          <Text className="text-sm text-muted-foreground">
            • {stats.budgets} budgets
          </Text>
        )}
        {stats.attachments > 0 && (
          <Text className="text-sm text-muted-foreground">
            • {stats.attachments} attachments
          </Text>
        )}
      </View>

      <Text className="mt-3 text-xs text-muted-foreground">
        All your data will be automatically synced to the cloud after creating
        an account.
      </Text>
    </View>
  )
}
