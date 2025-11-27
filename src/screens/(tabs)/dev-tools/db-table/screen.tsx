import { View } from 'react-native'
import { TableContent } from './components/table-content'

export default function DbTableScreen() {
  return (
    <View className="flex-1 bg-background">
      <TableContent />
    </View>
  )
}
