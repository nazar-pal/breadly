import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { router } from 'expo-router'
import { lazy, Suspense } from 'react'
import { Platform, View } from 'react-native'

const CatchAll = lazy(() =>
  import('@/components/dev-only/db-catch-all').then(module => ({
    default: module.CatchAll
  }))
)

export default function CatchAllScreen() {
  if (!__DEV__) return null
  if (Platform.OS === 'web') return null

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={24} className="text-foreground" />
        </Button>
      </View>
      <Suspense fallback={null}>
        <CatchAll />
      </Suspense>
    </View>
  )
}
