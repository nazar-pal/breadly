import { iconWithClassName } from '@/components/icon/iconWithClassName'
import {
  House,
  icons as lucideIcons,
  type LucideIcon
} from 'lucide-react-native'
import { View } from 'react-native'

export function CategoryCardIcon({
  name,
  type
}: {
  name: string
  type: 'expense' | 'income'
}) {
  // Convert to PascalCase (first letter uppercase, rest lowercase)
  const iconName = name || 'House'

  const Icon = (lucideIcons as Record<string, LucideIcon>)[iconName] || House

  // Apply className support to the icon
  iconWithClassName(Icon)

  return (
    <View className="h-9 w-9 items-center justify-center rounded-lg bg-muted/70">
      <Icon
        size={20}
        className={type === 'expense' ? 'text-expense' : 'text-income'}
      />
    </View>
  )
}
