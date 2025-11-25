import { rebalanceOrders } from '@/lib/utils/fractional-ordering'

interface Entity {
  id: string
  sortOrder: number
}

type ReturnType = {
  id: string
  newSortOrder: number
}[]

export function calculateRebalancedOrder<T extends Entity>(
  items: T[],
  itemId: string,
  targetIndex: number
): ReturnType {
  const itemToMove = items.find(item => item.id === itemId)
  if (!itemToMove) throw new Error('Item with id ' + itemId + ' not found')

  const itemsWithoutMoved = items.filter(item => item.id !== itemId)
  const newOrder = [...itemsWithoutMoved]
  newOrder.splice(targetIndex, 0, itemToMove)

  const rebalancedItems = rebalanceOrders(newOrder)

  return rebalancedItems
}
