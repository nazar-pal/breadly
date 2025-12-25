import { Platform } from 'react-native'

export default function CatchAllScreen() {
  if (!__DEV__) return null
  if (Platform.OS === 'web') return null

  // Dynamic require ensures this code is tree-shaken in production
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DbTableDev = require('@/screens/(tabs)/dev-tools/db-table').default
  return <DbTableDev />
}
