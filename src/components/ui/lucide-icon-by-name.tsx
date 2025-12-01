import { StringWithAutocompleteOptions } from '@/lib/types'
import { StringCase } from '@/lib/utils'
import type { LucideIcon, LucideProps } from 'lucide-react-native'
import { icons } from 'lucide-react-native'
import { Icon as UiIcon } from './lucide-icon'

type LucideIconName = keyof typeof icons
type IconName = StringWithAutocompleteOptions<LucideIconName>

export const allIcons: Record<LucideIconName, LucideIcon> = icons
export const allIconsKeys = Object.keys(allIcons) as LucideIconName[]

function normalizeLucideKey(candidate: string): LucideIconName {
  const FALLBACK_ICON_KEY: LucideIconName = 'Circle'
  const isLucideKey = (key: string): key is LucideIconName => key in allIcons

  const trimmed = candidate.trim()

  // Early return for empty input
  if (!trimmed.length) return FALLBACK_ICON_KEY

  // Try the trimmed input as-is first (most common case)
  if (isLucideKey(trimmed)) return trimmed

  // Try Pascal case conversion (Lucide icons use Pascal case)
  const pascalCase = StringCase.pascal(trimmed)
  if (isLucideKey(pascalCase)) return pascalCase

  return FALLBACK_ICON_KEY
}

function Icon({ name, ...rest }: LucideProps & { name: IconName }) {
  const ResolvedIcon = allIcons[normalizeLucideKey(name)]
  return <UiIcon as={ResolvedIcon} {...rest} />
}

export { Icon }
export type { IconName, LucideIconName }
