import { Platform } from 'react-native'

export default function PurchasesScreen() {
  if (!__DEV__) return null
  if (Platform.OS === 'web') return null

  // Dynamic require ensures this code is tree-shaken in production
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PurchasesDev = require('@/screens/(tabs)/dev-tools/purchases').default
  return <PurchasesDev />
}
