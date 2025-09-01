import { PowerSyncStatus } from '@/components/settings/power-sync-status'
import { Preferences } from '@/components/settings/preferences/preferences'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { GoogleOAuthButton, UserInfo } from '@/modules/session-and-migration'
import { DataLossWarning } from '@/modules/session-and-migration/components/data-loss-warning'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { ScrollView, View } from 'react-native'

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
