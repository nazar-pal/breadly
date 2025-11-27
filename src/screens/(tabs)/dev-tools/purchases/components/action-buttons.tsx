import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { router, type Href } from 'expo-router'
import { View } from 'react-native'

type ActionButtonsProps = {
  onRefresh: () => void
  onLogDebug: () => void
}

export function ActionButtons({ onRefresh, onLogDebug }: ActionButtonsProps) {
  return (
    <View className="mb-3 flex-row gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 flex-row gap-1.5"
        onPress={onRefresh}
      >
        <Icon name="RefreshCw" size={14} className="text-foreground" />
        <Text className="text-xs font-medium">Refresh</Text>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 flex-row gap-1.5"
        onPress={() => router.push('/paywall' as Href)}
      >
        <Icon name="CreditCard" size={14} className="text-foreground" />
        <Text className="text-xs font-medium">Paywall</Text>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 flex-row gap-1.5"
        onPress={onLogDebug}
      >
        <Icon name="Bug" size={14} className="text-muted-foreground" />
        <Text className="text-xs font-medium text-muted-foreground">Debug</Text>
      </Button>
    </View>
  )
}

