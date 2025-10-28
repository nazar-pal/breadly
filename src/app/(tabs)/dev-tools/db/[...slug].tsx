import DbTableDev from '@/screens/(tabs)/dev-tools/db-table'
import { Platform } from 'react-native'

export default function CatchAllScreen() {
  if (!__DEV__) return null
  if (Platform.OS === 'web') return null

  return <DbTableDev />
}
