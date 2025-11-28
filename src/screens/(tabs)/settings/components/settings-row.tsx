import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { Pressable, View } from 'react-native'

interface SettingsRowProps {
  icon: IconName
  title: string
  subtitle?: string
  onPress?: () => void
  showDivider?: boolean
  rightElement?: React.ReactNode
}

export function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  showDivider = true,
  rightElement
}: SettingsRowProps) {
  return (
    <Pressable
      className={`flex-row items-center py-3 active:opacity-70 ${
        showDivider ? 'border-border/30 border-b' : ''
      }`}
      onPress={onPress}
    >
      <View className="bg-muted mr-3 h-10 w-10 items-center justify-center rounded-full">
        <Icon name={icon} size={18} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-muted-foreground text-sm">{subtitle}</Text>
        )}
      </View>
      {rightElement || (
        <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
      )}
    </Pressable>
  )
}
