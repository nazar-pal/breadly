import { Icon } from '@/components/ui/icon-by-name'
import { CategoryType } from '@/data/client/db-schema'
import { View } from 'react-native'

export function CategoryCardIcon({
  name,
  type,
  size = 22
}: {
  name: string
  type: CategoryType
  size?: number
}) {
  return (
    <View className="items-center justify-center rounded-lg bg-muted/70 dark:bg-muted/50">
      <Icon
        name={name || 'House'}
        size={size}
        className={type === 'expense' ? 'text-expense' : 'text-income'}
      />
    </View>
  )
}
