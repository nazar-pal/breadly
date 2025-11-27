import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function EmptyState() {
  return (
    <Card>
      <CardContent className="items-center py-8">
        <View className="mb-3 rounded-full bg-muted p-3">
          <Icon name="Inbox" size={24} className="text-muted-foreground" />
        </View>
        <Text className="text-sm font-medium text-foreground">No Rows</Text>
        <Text className="mt-1 text-xs text-muted-foreground">
          This table is empty
        </Text>
      </CardContent>
    </Card>
  )
}

