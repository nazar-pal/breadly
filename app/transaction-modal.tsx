import { AddTransaction } from '@/modules/add-transaction'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TransactionModalScreen() {
  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      <AddTransaction />
    </SafeAreaView>
  )
}
