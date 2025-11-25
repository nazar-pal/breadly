import { Preferences } from '@/components/preferences/preferences'
import { PowerSyncStatus } from '@/components/settings/power-sync-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { usePurchasesStore } from '@/system/purchases'
import { GoogleOAuthButton, UserInfo } from '@/system/session-and-migration'
import { DataLossWarning } from '@/system/session-and-migration/components/data-loss-warning'
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo'
import * as Sentry from '@sentry/react-native'
import { router, type Href } from 'expo-router'
import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'

import { Pressable, ScrollView, Switch, View } from 'react-native'

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        <View className="native:max-w-md mx-auto w-full max-w-sm">
          <SignedOut>
            <Card>
              <CardContent className="pt-4">
                <GoogleOAuthButton />
                <DataLossWarning />
              </CardContent>
            </Card>
          </SignedOut>

          <SignedIn>
            <UserInfo />
            <AccountStatusCard />
          </SignedIn>
          {__DEV__ && <SyncModeToggle />}

          <PowerSyncStatus />
          <Preferences />
          <ImportDataCard />
          <UpdatesStatusCard />
        </View>
      </ScrollView>
    </View>
  )
}

function SyncModeToggle() {
  const { syncEnabled, setSyncEnabled } = useSessionPersistentStore()
  const { isPremium } = usePurchasesStore()

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sync Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-base font-medium">Enable Data Sync</Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              {isPremium
                ? syncEnabled
                  ? 'Your data will sync across devices'
                  : 'Turn on to protect your data with cloud backup'
                : 'Cloud sync requires Premium'}
            </Text>
          </View>
          <Switch
            value={syncEnabled && isPremium}
            onValueChange={value => {
              if (!isPremium) {
                router.push('/paywall')
                return
              }
              setSyncEnabled(value)
            }}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={syncEnabled && isPremium ? '#f5dd4b' : '#f4f3f4'}
            disabled={!isPremium}
          />
        </View>
      </CardContent>
    </Card>
  )
}

function AccountStatusCard() {
  const { isPremium } = usePurchasesStore()
  const { isSignedIn } = useAuth()
  const { syncEnabled } = useSessionPersistentStore()
  if (!isSignedIn) return null

  if (isPremium) {
    return (
      <Card className="mt-4 border-green-600/20 bg-green-50 dark:border-green-900/30 dark:bg-green-950/20">
        <CardContent className="py-4">
          <View className="flex-row items-center">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-green-600">
              <Icon name="Crown" size={16} className="text-white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-green-800 dark:text-green-200">
                Premium active
              </Text>
              <Text className="mt-0.5 text-sm text-green-700 dark:text-green-300">
                {syncEnabled
                  ? 'Cloud Sync is enabled — you are protected'
                  : 'Cloud Sync available — enable below to back up your data'}
              </Text>
              <View className="mt-2 flex-row items-center gap-2">
                <Badge className="border-green-600/30 bg-green-600">
                  <Icon name="ShieldCheck" size={12} className="text-white" />
                  <Text className="text-xs font-medium text-white">
                    Premium
                  </Text>
                </Badge>
                {syncEnabled ? (
                  <Badge className="border-green-600/30 bg-green-600">
                    <Icon name="CloudCheck" size={12} className="text-white" />
                    <Text className="text-xs font-medium text-white">
                      Sync on
                    </Text>
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Icon name="Cloud" size={12} className="text-foreground" />
                    <Text className="text-xs font-medium">Sync off</Text>
                  </Badge>
                )}
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="mt-4 border-violet-500/20 bg-violet-50 dark:border-violet-900/30 dark:bg-violet-950/20">
        <CardContent className="gap-3 py-4">
          <View className="flex-row items-center">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-violet-600">
              <Icon name="Sparkles" size={16} className="text-white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-violet-900 dark:text-violet-200">
                Go Premium to unlock Cloud Sync
              </Text>
              <Text className="mt-0.5 text-sm text-violet-800 dark:text-violet-300">
                Secure your data across devices and enable backups.
              </Text>
            </View>
          </View>
          <Button
            className="h-11"
            onPress={() => router.push('/paywall' as Href)}
          >
            <Text className="text-base font-semibold">Go Premium</Text>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-3 border-amber-500/30 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20">
        <CardContent className="py-4">
          <View className="flex-row items-start">
            <Icon
              name="ShieldAlert"
              size={18}
              className="mr-3 mt-0.5 text-amber-600 dark:text-amber-400"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-amber-800 dark:text-amber-200">
                Local mode only
              </Text>
              <Text className="mt-0.5 text-sm text-amber-700 dark:text-amber-300">
                Your data is stored only on this device and may be lost if you
                uninstall the app or lose access to this device.
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </>
  )
}

function ImportDataCard() {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Import Data</CardTitle>
        <Text variant="muted">Import categories or transactions from CSV</Text>
      </CardHeader>
      <CardContent className="gap-2 pt-2">
        <Pressable
          className="flex-row items-center rounded-lg border border-border bg-card px-4 py-3 active:bg-muted"
          onPress={() => router.push('/import/categories' as Href)}
        >
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Icon name="Folders" size={18} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium">Import Categories</Text>
            <Text className="text-sm text-muted-foreground">
              Add categories from a CSV file
            </Text>
          </View>
          <Icon
            name="ChevronRight"
            size={20}
            className="text-muted-foreground"
          />
        </Pressable>

        <Pressable
          className="flex-row items-center rounded-lg border border-border bg-card px-4 py-3 active:bg-muted"
          onPress={() => router.push('/import/transactions' as Href)}
        >
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Icon name="ArrowLeftRight" size={18} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium">Import Transactions</Text>
            <Text className="text-sm text-muted-foreground">
              Add transactions from a CSV file
            </Text>
          </View>
          <Icon
            name="ChevronRight"
            size={20}
            className="text-muted-foreground"
          />
        </Pressable>
      </CardContent>
    </Card>
  )
}

function UpdatesStatusCard() {
  const updates = Updates.useUpdates()
  const { isUpdateAvailable, isUpdatePending } = updates

  const isDisabled = __DEV__ || !Updates.isEnabled

  const [isChecking, setIsChecking] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null)

  const handleCheck = async () => {
    if (isDisabled || isChecking) return
    setErrorMessage(null)
    setIsChecking(true)
    try {
      await Updates.checkForUpdateAsync()
      setLastCheckedAt(new Date())
    } catch (err) {
      Sentry.captureException(err)
      const message = (err as any)?.message ?? 'Failed to check for updates'
      setErrorMessage(message)
    } finally {
      setIsChecking(false)
    }
  }

  const handleFetch = async () => {
    if (isDisabled || isFetching) return
    setErrorMessage(null)
    setIsFetching(true)
    try {
      await Updates.fetchUpdateAsync()
    } catch (err) {
      Sentry.captureException(err)
      const message = (err as any)?.message ?? 'Failed to download update'
      setErrorMessage(message)
    } finally {
      setIsFetching(false)
    }
  }

  const handleReload = async () => {
    if (isDisabled || isReloading) return
    setErrorMessage(null)
    setIsReloading(true)
    try {
      await Updates.reloadAsync()
    } catch (err) {
      Sentry.captureException(err)
      const message = (err as any)?.message ?? 'Failed to restart'
      setErrorMessage(message)
      setIsReloading(false)
    }
  }

  useEffect(() => {
    let isCancelled = false
    const run = async () => {
      if (isDisabled) return
      setErrorMessage(null)
      setIsChecking(true)
      try {
        await Updates.checkForUpdateAsync()
        if (!isCancelled) setLastCheckedAt(new Date())
      } catch (err) {
        Sentry.captureException(err)
        const message = (err as any)?.message ?? 'Failed to check for updates'
        if (!isCancelled) setErrorMessage(message)
      } finally {
        if (!isCancelled) setIsChecking(false)
      }
    }
    run()
    return () => {
      isCancelled = true
    }
  }, [isDisabled])

  if (isDisabled) return null

  const isBusy = isChecking || isFetching || isReloading

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>App Updates</CardTitle>
        {!isUpdateAvailable && !isUpdatePending ? (
          <Text variant="muted">{"You're up to date"}</Text>
        ) : null}
      </CardHeader>
      <CardContent className="pt-2">
        {isUpdatePending ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-base font-medium">
                Update ready to install
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Restart the app to apply the latest version.
              </Text>
            </View>
            <Button className="h-10" disabled={isBusy} onPress={handleReload}>
              <Text>Restart now</Text>
            </Button>
          </View>
        ) : isUpdateAvailable ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-base font-medium">Update available</Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Download the latest version in the background.
              </Text>
            </View>
            <Button className="h-10" disabled={isBusy} onPress={handleFetch}>
              <Text>Download</Text>
            </Button>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-base font-medium">
                {"You're up to date"}
              </Text>
              {lastCheckedAt ? (
                <Text className="mt-1 text-sm text-muted-foreground">
                  Checked {lastCheckedAt.toLocaleString()}
                </Text>
              ) : null}
            </View>
            <Button
              className="h-9"
              variant="outline"
              disabled={isBusy}
              onPress={handleCheck}
            >
              <Text>Check again</Text>
            </Button>
          </View>
        )}
        {errorMessage ? (
          <Text className="mt-3 text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </Text>
        ) : null}
      </CardContent>
    </Card>
  )
}
