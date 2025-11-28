import { Icon } from '@/components/ui/icon-by-name'
import { CategoryType } from '@/data/client/db-schema'
import { View } from 'react-native'

export function CategoryCardIcon({
  name,
  type
}: {
  name: string
  type: CategoryType
}) {
  return (
    <View className="bg-muted/70 h-9 w-9 items-center justify-center rounded-lg">
      <Icon
        name={name || 'House'}
        size={20}
        className={type === 'expense' ? 'text-expense' : 'text-income'}
      />
    </View>
  )
}
