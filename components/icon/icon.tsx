import type { LucideIcon, LucideProps } from 'lucide-react-native'
import { icons } from 'lucide-react-native'
import React from 'react'
import { iconWithClassName } from './iconWithClassName'

export type IconName = keyof typeof icons

interface Props extends LucideProps {
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

export function Icon({ name, ...rest }: Props) {
  const rawName = name as unknown as string
  const ResolvedIcon = resolveLucideIcon(rawName)
  iconWithClassName(ResolvedIcon)
  return <ResolvedIcon {...rest} />
}
