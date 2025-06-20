import { iconWithClassName } from '@/lib/icons/iconWithClassName'
import {
  House,
  icons as lucideIcons,
  type LucideIcon
} from 'lucide-react-native'

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
    <Icon
      size={20}
      className={type === 'expense' ? 'text-expense' : 'text-income'}
    />
  )
}
