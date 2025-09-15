import { Icon as UiIcon } from '@/components/ui/icon'
import { StringWithAutocompleteOptions } from '@/lib/types'
import type { LucideIcon, LucideProps } from 'lucide-react-native'
import { icons } from 'lucide-react-native'

type LucideIconName = keyof typeof icons
type IconName = StringWithAutocompleteOptions<LucideIconName>

interface IconProps extends LucideProps {
  /**
   * The icon name to render. Accepts Lucide keys (e.g. "Circle")
   * and arbitrary strings which will be normalized, such as
   * "circle", "trending-up", "dollar_sign", or "user plus".
   *
   * Use `LucideIconName` for autocompletion in TS, while still allowing
   * arbitrary strings at runtime.
   */
  name: IconName
}

/**
 * Normalize arbitrary icon strings to Lucide's PascalCase keys.
 *
 * Accepts strings like:
 * - "circle"        → "Circle"
 * - "trending-up"   → "TrendingUp"
 * - "dollar_sign"   → "DollarSign"
 * - "user plus"     → "UserPlus"
 */
function toLucideKey(candidate: string): string {
  if (!candidate) return 'Circle'

  // 1) Exact key may already be valid
  if ((icons as any)[candidate]) return candidate

  // 2) Try Capitalized first letter (common case: 'circle')
  const capitalized = candidate.charAt(0).toUpperCase() + candidate.slice(1)
  if ((icons as any)[capitalized]) return capitalized

  // 3) Convert kebab/snake/space to PascalCase: 'trending-up' → 'TrendingUp'
  const pascal = candidate
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  if ((icons as any)[pascal]) return pascal

  return 'Circle'
}

/**
 * Resolve a string to a LucideIcon component. Always returns a valid component.
 */
function resolveLucideIcon(name: string): LucideIcon {
  const key = toLucideKey(name)
  return (icons as any)[key] as LucideIcon
}

/**
 * Render a Lucide icon by name with Nativewind `className` support.
 *
 * This wrapper:
 * - Accepts a loose string for icon names with normalization
 * - Applies a default size of 14 (matching the `ui/icon` component)
 * - Reuses the `ui/icon` wrapper for consistent cssInterop
 */
function Icon({ name, ...rest }: IconProps) {
  const ResolvedIcon = resolveLucideIcon(name)
  return <UiIcon as={ResolvedIcon} {...rest} />
}

export { Icon }
export type { IconName, LucideIconName }
