import PurchasesDev from '@/screens/(tabs)/dev-tools/purchases'
import { Platform } from 'react-native'

export default function PurchasesScreen() {
  if (Platform.OS === 'web') return null
  return <PurchasesDev />
}
