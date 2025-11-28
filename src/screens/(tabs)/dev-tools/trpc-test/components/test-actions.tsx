import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

type TestActionsProps = {
  onRunHello: () => void
  onRunAuth: () => void
  isRunning: boolean
}

export function TestActions({
  onRunHello,
  onRunAuth,
  isRunning
}: TestActionsProps) {
  return (
    <Card className="mb-4">
      <CardContent className="gap-3 py-3">
        <View className="flex-row gap-2">
          <ActionButton
            label="Hello"
            description="Public endpoint"
            icon="Globe"
            onPress={onRunHello}
            disabled={isRunning}
          />
          <ActionButton
            label="Auth"
            description="Protected endpoint"
            icon="Shield"
            onPress={onRunAuth}
            disabled={isRunning}
          />
        </View>
      </CardContent>
    </Card>
  )
}

function ActionButton({
  label,
  description,
  icon,
  onPress,
  disabled
}: {
  label: string
  description: string
  icon: string
  onPress: () => void
  disabled: boolean
}) {
  return (
    <Button
      variant="outline"
      className="h-auto flex-1 flex-col items-start gap-1 px-3 py-3"
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex-row items-center gap-2">
        <Icon name={icon} size={14} className="text-foreground" />
        <Text className="font-medium">{label}</Text>
      </View>
      <Text className="text-muted-foreground text-xs">{description}</Text>
    </Button>
  )
}
