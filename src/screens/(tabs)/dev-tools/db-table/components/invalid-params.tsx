import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

type InvalidParamsProps = {
  message: string
}

export function InvalidParams({ message }: InvalidParamsProps) {
  return (
    <View className="bg-background flex-1 p-4">
      <Card>
        <CardContent className="items-center py-8">
          <View className="bg-destructive/10 mb-3 rounded-full p-3">
            <Icon name="AlertTriangle" size={24} className="text-destructive" />
          </View>
          <Text className="text-foreground text-sm font-medium">
            Invalid Parameters
          </Text>
          <Text className="text-muted-foreground mt-1 text-center text-xs">
            {message}
          </Text>
          <Text className="bg-muted text-muted-foreground mt-3 rounded px-2 py-1 font-mono text-xs">
            Expected: /db/[view|table]/[name]
          </Text>
        </CardContent>
      </Card>
    </View>
  )
}
