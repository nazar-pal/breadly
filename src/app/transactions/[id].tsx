import Transaction from '@/screens/transaction'
import { useLocalSearchParams } from 'expo-router'

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <Transaction id={id} />
}
