import { Icon, type IconName } from '@/components/icon'
import { View } from 'react-native'

export function CategoryCardIcon({
  name,
  type
}: {
  name: string
  type: 'expense' | 'income'
}) {
  // Convert to PascalCase (first letter uppercase, rest lowercase)
  const iconName = (name || 'House') as IconName

  return (
    <View className="h-9 w-9 items-center justify-center rounded-lg bg-muted/70">
      <Icon
        name={iconName}
        size={20}
        className={type === 'expense' ? 'text-expense' : 'text-income'}
      />
    </View>
  )
}
