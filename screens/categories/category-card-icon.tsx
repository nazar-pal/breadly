import { Icon } from '@/components/icon'
import { View } from 'react-native'

export function CategoryCardIcon({
  name,
  type
}: {
  name: string
  type: 'expense' | 'income'
}) {
  return (
    <View className="h-9 w-9 items-center justify-center rounded-lg bg-muted/70">
      <Icon
        name={name || 'House'}
        size={20}
        className={type === 'expense' ? 'text-expense' : 'text-income'}
      />
    </View>
  )
}
