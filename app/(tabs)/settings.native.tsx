import { PowerSyncStatus } from '@/components/settings/power-sync-status'
import { Preferences } from '@/components/settings/preferences/preferences'
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
import { Link, router, type Href } from 'expo-router'
import { ScrollView, Switch, View } from 'react-native'

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

          <Card className="mt-6">
            <CardContent className="items-center justify-center py-4">
              <Link href="/test" asChild>
                <Text className="text-center text-muted-foreground">
                  🧪 Test Connectivity
                </Text>
              </Link>
            </CardContent>
          </Card>
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
