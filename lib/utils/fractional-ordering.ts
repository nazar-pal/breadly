import { env } from '@/env'

/**
 * Calculate sort order when inserting an item between two existing items
 */
function calculateInsertOrder(
  prevOrder: number | null,
  nextOrder: number | null
): number {
  const increment = env.EXPO_PUBLIC_SORT_ORDER_INCREMENT

  // Moving to the beginning (before first item)
  if (prevOrder === null && nextOrder !== null) {
    return nextOrder - increment
  }

  // Moving to the end (after last item)
  if (prevOrder !== null && nextOrder === null) {
    return prevOrder + increment
  }

  // Moving between two items
  if (prevOrder !== null && nextOrder !== null) {
    const midpoint = (prevOrder + nextOrder) / 2

    // If the midpoint is too close to either value, we need more space
    if (
      Math.floor(midpoint) === prevOrder ||
      Math.ceil(midpoint) === nextOrder
    ) {
      throw new Error(
        'Insufficient space for fractional ordering - rebalancing needed'
      )
    }

    return Math.floor(midpoint)
  }

  // First item in empty list
  return increment
}

/**
 * Calculate new sort order when moving an item to a specific position
 * @param items - Array of items with id and sortOrder
 * @param movedItemId - ID of the item being moved
 * @param targetIndex - Target position in the array (0-based)
 * @returns New sort order for the moved item
 * @throws Error if item not found, target index is invalid, or insufficient space for fractional ordering
 */
export function calculateMoveOrder(
  items: { id: string; sortOrder: number }[],
  movedItemId: string,
  targetIndex: number
): number {
  if (!items.find(item => item.id === movedItemId))
    throw new Error('Can not calculate move order - moved item not found')

  if (targetIndex < 0 || targetIndex >= items.length)
    throw new Error('Can not calculate move order - target index out of bounds')

  const otherItems = items.filter(item => item.id !== movedItemId)

  const prevItem = targetIndex > 0 ? otherItems[targetIndex - 1] : null
  const nextItem =
    targetIndex < otherItems.length ? otherItems[targetIndex] : null

  const prevOrder = prevItem?.sortOrder ?? null
  const nextOrder = nextItem?.sortOrder ?? null

  return calculateInsertOrder(prevOrder, nextOrder)
}

/**
 * Check if rebalancing is needed due to insufficient space between items
 * @param items - Array of items with sortOrder values
 * @returns True if any two consecutive items have sortOrder difference < 2
 */
export function needsRebalancing(items: { sortOrder: number }[]): boolean {
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  for (let i = 1; i < sortedItems.length; i++) {
    const diff = sortedItems[i].sortOrder - sortedItems[i - 1].sortOrder
    if (diff < 2) {
      return true
    }
  }

  return false
}

/**
 * Rebalance sort orders by redistributing them with even spacing.
 * The input array must be in the desired final sort order - items will maintain their relative positions.
 * @param items - Array of items with id and sortOrder, in desired final order
 * @returns Array of objects with id and newSortOrder, in same order but with evenly distributed sort values
 */
export function rebalanceOrders(
  items: { id: string; sortOrder: number }[]
): { id: string; newSortOrder: number }[] {
  const increment = env.EXPO_PUBLIC_SORT_ORDER_INCREMENT

  return items.map((item, index) => ({
    id: item.id,
    newSortOrder: (index + 1) * increment
  }))
}
