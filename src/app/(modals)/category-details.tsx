import CategoryDetailsModal from '@/screens/(modals)/category-details'
import { router, useLocalSearchParams } from 'expo-router'

export default function TransactionModalScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>()

  if (!categoryId) {
    router.back()
    return null
  }

  return <CategoryDetailsModal categoryId={categoryId} />
}
