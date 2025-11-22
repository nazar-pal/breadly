import { StringWithAutocompleteOptions } from '@/lib/types'
import type { LucideIcon, LucideProps } from 'lucide-react-native'
import { icons } from 'lucide-react-native'
import { Icon as UiIcon } from './icon'

type LucideIconName = keyof typeof icons
type IconName = StringWithAutocompleteOptions<LucideIconName>

export const allIcons: Record<LucideIconName, LucideIcon> = icons

function normalizeLucideKey(candidate: string): LucideIconName {
  const FALLBACK_ICON_KEY: LucideIconName = 'Circle'
  const isLucideKey = (key: string): key is LucideIconName => key in allIcons

  const capitalizeFirst = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1)

  const toPascalCase = (value: string): string =>
    value
      .split(/[-_\s]+/)
      .map(part => (part ? capitalizeFirst(part) : ''))
      .join('')

  if (!candidate) return FALLBACK_ICON_KEY

  const candidates = [
    candidate,
    capitalizeFirst(candidate),
    toPascalCase(candidate)
  ]

  for (const key of candidates) if (isLucideKey(key)) return key

  return FALLBACK_ICON_KEY
}

function Icon({ name, ...rest }: LucideProps & { name: IconName }) {
  const ResolvedIcon = allIcons[normalizeLucideKey(name)]
  return <UiIcon as={ResolvedIcon} {...rest} />
}

export { Icon }
export type { IconName, LucideIconName }
