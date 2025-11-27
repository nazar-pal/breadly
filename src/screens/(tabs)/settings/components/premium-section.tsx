import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { usePurchasesStore } from '@/system/purchases'
import { useAuth } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient'
import { router, type Href } from 'expo-router'
import { Pressable, View } from 'react-native'

export function PremiumSection() {
  const { isPremium } = usePurchasesStore()
  const { isSignedIn } = useAuth()
  const { syncEnabled } = useSessionPersistentStore()

  if (!isSignedIn || isPremium) return null

  return (
    <Pressable
      onPress={() => router.push('/paywall' as Href)}
      className="overflow-hidden rounded-xl border border-violet-500/20 bg-violet-50 active:opacity-90 dark:bg-violet-950/30"
    >
      <View className="flex-row items-center px-4 py-4">
        <View className="mr-3 overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#8b5cf6', '#4f46e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="Sparkles" size={18} className="text-white" />
          </LinearGradient>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-violet-900 dark:text-violet-200">
            Upgrade to Premium
          </Text>
          <Text className="text-sm text-violet-700 dark:text-violet-400">
            Unlock cloud sync & advanced features
          </Text>
        </View>
        <Icon
          name="ChevronRight"
          size={20}
          className="text-violet-400 dark:text-violet-500"
        />
      </View>

      {!syncEnabled && (
        <View className="flex-row items-center gap-2 border-t border-violet-200/50 bg-amber-50/50 px-4 py-2.5 dark:border-violet-800/30 dark:bg-amber-950/20">
          <Icon
            name="AlertTriangle"
            size={14}
            className="text-amber-600 dark:text-amber-400"
          />
          <Text className="flex-1 text-xs text-amber-700 dark:text-amber-300">
            Your data is only stored locally
          </Text>
        </View>
      )}
    </Pressable>
  )
}

