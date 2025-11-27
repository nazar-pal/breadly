import type { ReactNode } from 'react'
import { Text } from 'react-native'
import type { SortMode, SortOrder } from './types'

// Custom ordering based on folder convention numbers
const TABLE_SORT_GROUPS: Record<string, string[]> = {
  '1': ['currencies'],
  '2': ['exchange_rates', 'exchangeRates'],
  '3': ['user_preferences'],
  '4': ['categories'],
  '5': ['budgets'],
  '6': ['accounts'],
  '7': ['transactions'],
  '8': ['attachments'],
  '9': ['transaction_attachments', 'transactionAttachments']
}

const ALL_GROUP_PATTERNS: string[] = Object.values(TABLE_SORT_GROUPS).flat()
const INACTIVE_PREFIX = 'inactive_synced_'

function normalize(s: string): string {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function getTableGroupNumber(name: string): number | null {
  const normName = normalize(name)
  let matchedGroup: number | null = null
  let longest = -1

  for (const key of Object.keys(TABLE_SORT_GROUPS)) {
    const patterns = TABLE_SORT_GROUPS[key]
    for (const p of patterns) {
      const pat = normalize(p)
      if (normName.includes(pat) && pat.length > longest) {
        longest = pat.length
        matchedGroup = Number(key)
      }
    }
  }

  return matchedGroup
}

function escapeRegex(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function renderHighlightedName(name: string): ReactNode[] {
  const patterns = ALL_GROUP_PATTERNS.slice().sort(
    (a, b) => b.length - a.length
  )
  if (!patterns.length) return [name]

  const regex = new RegExp(patterns.map(escapeRegex).join('|'), 'gi')
  const children: ReactNode[] = []
  let lastIndex = 0
  let keyIndex = 0

  for (const match of name.matchAll(regex)) {
    const start = match.index ?? 0
    const end = start + match[0].length

    if (start > lastIndex) {
      children.push(
        <Text key={`t-${keyIndex++}`}>{name.slice(lastIndex, start)}</Text>
      )
    }
    children.push(
      <Text key={`h-${keyIndex++}`} className="text-primary">
        {name.slice(start, end)}
      </Text>
    )
    lastIndex = end
  }

  if (lastIndex < name.length) {
    children.push(<Text key={`t-${keyIndex++}`}>{name.slice(lastIndex)}</Text>)
  }

  return children
}

function getInactiveAwareSortKey(name: string) {
  const lower = String(name).toLowerCase()
  const isInactive = lower.startsWith(INACTIVE_PREFIX)
  const base = isInactive ? lower.slice(INACTIVE_PREFIX.length) : lower
  return { base, isInactive, fullLower: lower }
}

export function createEntityComparator(
  sortMode: SortMode,
  sortOrder: SortOrder,
  rowCounts: Record<string, number>
) {
  return (a: { name: string }, b: { name: string }) => {
    if (sortMode === 'rows') {
      const ra = rowCounts[a.name] ?? 0
      const rb = rowCounts[b.name] ?? 0
      const cmp = ra - rb
      return sortOrder === 'asc' ? cmp : -cmp
    }

    const ga = getTableGroupNumber(a.name) ?? 9999
    const gb = getTableGroupNumber(b.name) ?? 9999
    const primary = ga - gb
    if (primary !== 0) return primary

    const ka = getInactiveAwareSortKey(a.name)
    const kb = getInactiveAwareSortKey(b.name)
    const baseCmp = ka.base.localeCompare(kb.base)
    if (baseCmp !== 0) return baseCmp

    if (ka.isInactive !== kb.isInactive) return ka.isInactive ? 1 : -1
    return ka.fullLower.localeCompare(kb.fullLower)
  }
}

