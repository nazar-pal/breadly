import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { usePurchases } from '@/system-v2/purchases'
import { SignOutButton } from '@/system-v2/components'
import { useSyncEnabled } from '@/system-v2/orchestrator'
import { useUser } from '@clerk/clerk-expo'
import { useStatus } from '@powersync/react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

export function ProfileSection() {
  const { user } = useUser()
  const { isPremium } = usePurchases()
  const syncEnabled = useSyncEnabled()
  const status = useStatus()

  if (!user) return null

  const displayName =
    user.fullName?.trim() ||
    (user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : '') ||
    user.username ||
    'User'

  const email = user.emailAddresses?.[0]?.emailAddress || 'No email'

  const getSyncLabel = () => {
    if (!syncEnabled) return { label: 'Sync off', color: 'gray' as const }
    if (status.connecting)
      return { label: 'Connecting…', color: 'blue' as const }
    if (status.connected) return { label: 'Synced', color: 'green' as const }
    return { label: 'Offline', color: 'gray' as const }
  }

  const syncInfo = getSyncLabel()

  return (
    <View>
      <Card>
        <CardContent className="py-4">
          <View className="flex-row items-center">
            <View className="mr-4 overflow-hidden rounded-full">
              <LinearGradient
                colors={['#8b5cf6', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text className="text-xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>

            <View className="flex-1">
              <Text className="text-lg font-semibold">{displayName}</Text>
              <Text className="text-muted-foreground text-sm">{email}</Text>

              <View className="mt-2 flex-row flex-wrap gap-1.5">
                {isPremium ? (
                  <Badge className="border-amber-500/30 bg-amber-500">
                    <Icon name="Crown" size={10} className="text-white" />
                    <Text className="text-[10px] font-medium text-white">
                      Premium
                    </Text>
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Text className="text-[10px] font-medium">Free</Text>
                  </Badge>
                )}

                <Badge
                  variant="secondary"
                  className={
                    syncInfo.color === 'green'
                      ? 'border-green-500/30 bg-green-500/10'
                      : syncInfo.color === 'blue'
                        ? 'border-blue-500/30 bg-blue-500/10'
                        : ''
                  }
                >
                  <View
                    className={`h-1.5 w-1.5 rounded-full ${
                      syncInfo.color === 'green'
                        ? 'bg-green-500'
                        : syncInfo.color === 'blue'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                    }`}
                  />
                  <Text
                    className={`text-[10px] font-medium ${
                      syncInfo.color === 'green'
                        ? 'text-green-700 dark:text-green-400'
                        : syncInfo.color === 'blue'
                          ? 'text-blue-700 dark:text-blue-400'
                          : ''
                    }`}
                  >
                    {syncInfo.label}
                  </Text>
                </Badge>
              </View>
            </View>
          </View>

          <View className="border-border/50 mt-4 border-t pt-4">
            <SignOutButton />
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
