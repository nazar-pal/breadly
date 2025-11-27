import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

type InvalidParamsProps = {
  message: string
}

export function InvalidParams({ message }: InvalidParamsProps) {
  return (
    <View className="flex-1 bg-background p-4">
      <Card>
        <CardContent className="items-center py-8">
          <View className="mb-3 rounded-full bg-destructive/10 p-3">
            <Icon name="AlertTriangle" size={24} className="text-destructive" />
          </View>
          <Text className="text-sm font-medium text-foreground">
            Invalid Parameters
          </Text>
          <Text className="mt-1 text-center text-xs text-muted-foreground">
            {message}
          </Text>
          <Text className="mt-3 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
            Expected: /db/[view|table]/[name]
          </Text>
        </CardContent>
      </Card>
    </View>
  )
}

