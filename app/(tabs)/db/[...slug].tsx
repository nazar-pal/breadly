import { lazy, Suspense } from 'react'
import { Platform } from 'react-native'

const CatchAll = lazy(() =>
  import('@/components/db-catch-all').then(module => ({
    default: module.CatchAll
  }))
)

export default function CatchAllScreen() {
  if (!__DEV__) return null
  if (Platform.OS === 'web') return null

  return (
    <Suspense fallback={null}>
      <CatchAll />
    </Suspense>
  )
}
