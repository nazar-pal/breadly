import {
  calculateMoveOrder,
  needsRebalancing,
  rebalanceOrders
} from './fractional-ordering'

interface Entity {
  id: string
  sortOrder: number
}

type EntitiesState<T extends Entity> = { newState: T[]; rebalanced: boolean }

function handleRebalancingReorder<T extends Entity>(
  entitiesList: T[],
  entityId: string,
  targetIndex: number
): EntitiesState<T> {
  const entityToMove = entitiesList.find(ent => ent.id === entityId)
  if (!entityToMove)
    // should never happen
    throw new Error('Entity with id ' + entityId + ' not found')

  const entitiesWithoutMoved = entitiesList.filter(ent => ent.id !== entityId)
  const newOrder = [...entitiesWithoutMoved]
  newOrder.splice(targetIndex, 0, entityToMove)

  const rebalancedEntities = rebalanceOrders(newOrder)
  const sortOrderMap = new Map(
    rebalancedEntities.map(ent => [ent.id, ent.newSortOrder])
  )

  const newState = entitiesList
    .map(entity => ({
      ...entity,
      sortOrder: sortOrderMap.get(entity.id) ?? entity.sortOrder
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return { newState, rebalanced: true }
}

function handleFractionalReorder<T extends Entity>(
  entitiesList: T[],
  entityId: string,
  targetIndex: number
): EntitiesState<T> {
  const newSortOrder = calculateMoveOrder(entitiesList, entityId, targetIndex)

  const newState = entitiesList
    .map(entity =>
      entity.id === entityId ? { ...entity, sortOrder: newSortOrder } : entity
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return { newState, rebalanced: false }
}

/**
 * Calculate optimistic state using the same logic as the server
 */
export function calculateOptimisticState<T extends Entity>(
  entitiesList: T[],
  entityId: string,
  targetIndex: number
): EntitiesState<T> {
  const entityToMove = entitiesList.find(ent => ent.id === entityId)
  if (!entityToMove)
    // should never happen
    throw new Error('Entity with id ' + entityId + ' not found')

  if (targetIndex >= entitiesList.length)
    // should never happen
    throw new Error('Target index is out of bounds')

  // Check if rebalancing is needed proactively (same logic as server)
  if (needsRebalancing(entitiesList)) {
    return handleRebalancingReorder(entitiesList, entityId, targetIndex)
  } else {
    return handleFractionalReorder(entitiesList, entityId, targetIndex)
  }
}
