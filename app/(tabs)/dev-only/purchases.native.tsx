import { PurchasesDetails } from '@/components/dev-only/purchases-details/purchases-details'
import { ScrollView } from 'react-native'

export default function PurchasesScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <PurchasesDetails />
    </ScrollView>
  )
}
