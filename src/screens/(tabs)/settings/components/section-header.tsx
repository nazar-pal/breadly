import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

interface SectionHeaderProps {
  title: string
  icon?: IconName
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center gap-2">
      {icon && <Icon name={icon} size={16} className="text-muted-foreground" />}
      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </Text>
    </View>
  )
}

