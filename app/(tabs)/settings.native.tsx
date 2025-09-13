import { PowerSyncStatus } from '@/components/settings/power-sync-status'
import { Preferences } from '@/components/settings/preferences/preferences'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { GoogleOAuthButton, UserInfo } from '@/modules/session-and-migration'
import { DataLossWarning } from '@/modules/session-and-migration/components/data-loss-warning'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
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
            <SyncModeToggle />
          </SignedIn>

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
              {syncEnabled
                ? 'Your data will sync across devices'
                : 'Your data stays on this device only'}
            </Text>
          </View>
          <Switch
            value={syncEnabled}
            onValueChange={setSyncEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={syncEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </CardContent>
    </Card>
  )
}
