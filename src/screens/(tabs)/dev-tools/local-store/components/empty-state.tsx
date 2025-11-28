import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function EmptyState() {
  return (
    <Card className="mt-8">
      <CardContent className="items-center py-12">
        <View className="bg-muted mb-4 rounded-full p-4">
          <Icon name="Database" size={32} className="text-muted-foreground" />
        </View>
        <Text className="text-foreground mb-2 text-lg font-semibold">
          No Data Stored
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          Local storage is empty. Add items using the + button or they will
          appear as you use the app.
        </Text>
      </CardContent>
    </Card>
  )
}
