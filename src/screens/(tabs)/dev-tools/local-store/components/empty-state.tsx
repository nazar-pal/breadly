import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function EmptyState() {
  return (
    <Card className="mt-8">
      <CardContent className="items-center py-12">
        <View className="mb-4 rounded-full bg-muted p-4">
          <Icon name="Database" size={32} className="text-muted-foreground" />
        </View>
        <Text className="mb-2 text-lg font-semibold text-foreground">
          No Data Stored
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          Local storage is empty. Add items using the + button or they will
          appear as you use the app.
        </Text>
      </CardContent>
    </Card>
  )
}
