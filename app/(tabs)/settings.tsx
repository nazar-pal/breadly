import { PowerSyncStatus } from '@/components/settings/power-sync-status'
import { Preferences } from '@/components/settings/preferences/preferences'
import { Card, CardContent } from '@/components/ui/card'
import { GoogleOAuthButton, UserInfo } from '@/modules/session-and-migration'
import { DataLossWarning } from '@/modules/session-and-migration/components/data-loss-warning'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
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
        </View>
      </ScrollView>
    </View>
  )
}
