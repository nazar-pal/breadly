import { GoogleOAuthButton, SignOutButton } from '@/components/auth'
import { Preferences } from '@/components/settings/preferences'
import { MigrationPreview } from '@/components/shared/migration-preview'
import { PowerSyncStatus } from '@/components/shared/power-sync-status'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useMigrationPreview } from '@/lib/hooks/useMigrationPreview'
import { ChevronRight, Mail, Shield, User } from '@/lib/icons'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function MailSignInButton() {
  return (
    <Link href="/auth" asChild>
      <Pressable className="flex-row items-center justify-between py-3 pb-0 active:opacity-70">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Mail size={20} className="text-primary" />
          </View>
          <View>
            <Text className="text-base text-foreground">
              Continue with Email
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              Sign in or create an account with email and password
            </Text>
          </View>
        </View>
        <ChevronRight size={20} className="text-muted-foreground" />
      </Pressable>
    </Link>
  )
}

function DataLossWarning() {
  const { stats, isLoading } = useMigrationPreview()

  if (isLoading || !stats || stats.total === 0) {
    return null
  }

  return (
    <View className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-950/20">
      <View className="mb-2 flex-row items-center">
        <Shield size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
        <Text className="font-medium text-blue-800 dark:text-blue-200">
          Protect your financial data
        </Text>
      </View>
      <Text className="mb-3 text-sm text-blue-700 dark:text-blue-300">
        Your {stats.total} items are currently stored only on this device.
        Create an account to unlock access to cloud synchronization and advanced
        AI features.
      </Text>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {stats.transactions > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.transactions} transactions
          </Text>
        )}
        {stats.accounts > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.accounts} accounts
          </Text>
        )}
        {stats.categories > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.categories} categories
          </Text>
        )}
        {stats.budgets > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.budgets} budgets
          </Text>
        )}
      </View>
    </View>
  )
}

export default function SettingsScreen() {
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleGoogleAuthError = (error: string) => {
    setErrorMessage(error)
    // Clear error after 5 seconds
    setTimeout(() => setErrorMessage(null), 5000)
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
      >
        {/* Authentication Section - Only show for guest users */}
        <SignedOut>
          <View>
            <Text className="mb-4 text-lg font-semibold text-foreground">
              Sign in to save your data
            </Text>
            {/* Data Loss Warning */}
            <DataLossWarning />
            <Card>
              <CardContent>
                {/* Google Sign In Button */}
                <GoogleOAuthButton onError={handleGoogleAuthError} />

                {/* Divider */}
                <View className="my-4 flex-row items-center">
                  <View className="h-px flex-1 bg-border" />
                  <Text className="mx-4 text-sm text-muted-foreground">or</Text>
                  <View className="h-px flex-1 bg-border" />
                </View>

                {/* Email Sign In Button */}
                <MailSignInButton />

                {/* Error Message */}
                {errorMessage && (
                  <View className="mt-4 rounded-lg bg-destructive/10 p-3">
                    <Text className="text-sm text-destructive">
                      {errorMessage}
                    </Text>
                  </View>
                )}
              </CardContent>
            </Card>
          </View>
        </SignedOut>

        <SignedIn>
          <View>
            <Text className="mb-4 text-lg font-semibold text-foreground">
              Account
            </Text>
            <Card>
              <CardContent>
                <View className="my-4 flex-row items-center">
                  <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-secondary">
                    <User size={32} className="text-foreground" />
                  </View>
                  <View className="ml-4">
                    <Text className="mb-1 text-lg font-semibold text-foreground">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username || 'User'}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {user?.emailAddresses[0]?.emailAddress || 'No email'}
                    </Text>
                  </View>
                </View>
                <View className="my-4 h-px w-full bg-border" />
                <SignOutButton />
              </CardContent>
            </Card>
          </View>
        </SignedIn>

        <PowerSyncStatus />

        <MigrationPreview />

        <Preferences />

        <Text className="mt-6 text-center text-sm text-muted-foreground">
          Breadly v1.0.0
        </Text>
      </ScrollView>
    </View>
  )
}
