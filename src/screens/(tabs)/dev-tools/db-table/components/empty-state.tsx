import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function EmptyState() {
  return (
    <Card>
      <CardContent className="items-center py-8">
        <View className="bg-muted mb-3 rounded-full p-3">
          <Icon name="Inbox" size={24} className="text-muted-foreground" />
        </View>
        <Text className="text-foreground text-sm font-medium">No Rows</Text>
        <Text className="text-muted-foreground mt-1 text-xs">
          This table is empty
        </Text>
      </CardContent>
    </Card>
  )
}
