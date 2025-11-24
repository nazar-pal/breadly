import { randomUUID } from 'expo-crypto'
import { CsvRow } from './csv-row-schema'

/**
 * Replace CSV-sourced ids with new DB ids while keeping all other fields intact.
 */
export function mapCsvIdsToDbIds(rows: CsvRow[]) {
  const csvIdToDbId = new Map<string, string>()

  for (const row of rows) {
    csvIdToDbId.set(row.id, randomUUID())
  }

  return rows.map(row => {
    const dbId = csvIdToDbId.get(row.id)!
    const dbParentId = row.parentId ? csvIdToDbId.get(row.parentId) : undefined

    return {
      id: dbId,
      name: row.name,
      type: row.type,
      parentId: dbParentId,
      icon: row.icon,
      createdAt: row.createdAt,
      isArchived: row.isArchived,
      archivedAt: row.archivedAt
    }
  })
}

type PreorderByParentRow = ReturnType<typeof mapCsvIdsToDbIds>[number]

function buildHierarchyIndexes(rows: PreorderByParentRow[]) {
  const childrenByParentId = new Map<string, PreorderByParentRow[]>()
  const roots: PreorderByParentRow[] = []

  for (const row of rows) {
    if (row.parentId) {
      const siblings = childrenByParentId.get(row.parentId) ?? []
      siblings.push(row)
      childrenByParentId.set(row.parentId, siblings)
    } else {
      roots.push(row)
    }
  }

  return { childrenByParentId, roots }
}

/**
 * Perform a pre-order traversal: each parent immediately followed by its children.
 * Includes simple cycle detection to guard against malformed hierarchies.
 */
export function preorderByParent(rows: PreorderByParentRow[]) {
  const { childrenByParentId, roots } = buildHierarchyIndexes(rows)

  const ordered: PreorderByParentRow[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function traverse(node: PreorderByParentRow) {
    if (visited.has(node.id)) return

    if (visiting.has(node.id)) {
      throw new Error(
        `Circular dependency detected for category: ${String((node as any).name ?? node.id)}`
      )
    }

    visiting.add(node.id)
    ordered.push(node)

    for (const child of childrenByParentId.get(node.id) ?? []) {
      traverse(child)
    }

    visiting.delete(node.id)
    visited.add(node.id)
  }

  for (const root of roots) {
    traverse(root)
  }

  // Safety: include any orphan nodes if they exist
  for (const row of rows) {
    if (!visited.has(row.id)) {
      traverse(row)
    }
  }

  return ordered
}

/**
 * Assign a numeric sortOrder, using separate sequences for root and child rows.
 * Note: only rows whose parentId is strictly null are treated as roots.
 */
export function assignSortOrders(
  rows: PreorderByParentRow[],
  increment: number
) {
  let rootIndex = 0
  let childIndex = 0

  return rows.map(row => {
    const sortOrder = row.parentId
      ? ++rootIndex * increment
      : ++childIndex * increment

    return { ...row, sortOrder }
  })
}
