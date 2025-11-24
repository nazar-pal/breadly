import type { CategoryType } from '@/data/client/db-schema/table_4_categories'
import type { CsvRow } from './csv-row-schema'

type RowIssue = {
  index: number
  path: keyof CsvRow
  message: string
}

/**
 * Compute duplicate id issues (flags all but the first occurrence).
 */
export function computeDuplicateCsvIdIssues(rows: CsvRow[]): RowIssue[] {
  const issues: RowIssue[] = []
  const firstIndexById = new Map<string, number>()

  rows.forEach((row, index) => {
    if (firstIndexById.has(row.id)) {
      issues.push({
        index,
        path: 'id',
        message: 'Duplicate id: must be unique within the file'
      })
      return
    }
    firstIndexById.set(row.id, index)
  })

  return issues
}

/**
 * Validate parentId references by CSV id:
 * - Parent must exist
 * - Parent and child must share the same type
 * - Category may not reference itself
 */
export function computeParentIdValidationIssues(rows: CsvRow[]): RowIssue[] {
  const byId = new Map<string, { index: number; type: CategoryType }>()
  rows.forEach((row, index) => {
    byId.set(row.id, { index, type: row.type })
  })

  const issues: RowIssue[] = []

  rows.forEach((row, index) => {
    if (!row.parentId) return

    if (row.parentId === row.id) {
      issues.push({
        index,
        path: 'parentId',
        message: 'Category may not reference itself as its parent'
      })
      return
    }

    const parent = byId.get(row.parentId)
    if (!parent) {
      issues.push({
        index,
        path: 'parentId',
        message: `Parent with id "${row.parentId}" not found in the import file`
      })
      return
    }

    if (parent.type !== row.type) {
      issues.push({
        index,
        path: 'parentId',
        message:
          'Parent and child must have the same type (income/expense mismatch)'
      })
    }
  })

  return issues
}

/**
 * Enforce single-level hierarchy using CSV ids:
 * - If a category is referenced as a parent by any other category,
 *   it must not have its own parent.
 */
export function computeSingleLevelHierarchyIssues(rows: CsvRow[]): RowIssue[] {
  const referencedParents = new Set<string>()
  rows.forEach(row => {
    if (row.parentId) referencedParents.add(row.parentId)
  })

  const issues: RowIssue[] = []
  rows.forEach((row, index) => {
    if (row.parentId && referencedParents.has(row.id)) {
      issues.push({
        index,
        path: 'parentId',
        message:
          'A category referenced as a parent may not reference another category (only one level allowed)'
      })
    }
  })

  return issues
}

/**
 * Validate archived fields consistency across rows.
 */
export function computeArchivedFieldIssues(rows: CsvRow[]): RowIssue[] {
  const issues: RowIssue[] = []
  rows.forEach((row, index) => {
    if (row.isArchived && !row.archivedAt) {
      issues.push({
        index,
        path: 'archivedAt',
        message: 'archivedAt is required when isArchived is true'
      })
      return
    }
    if (row.archivedAt) {
      if (row.archivedAt.getTime() < row.createdAt.getTime()) {
        issues.push({
          index,
          path: 'archivedAt',
          message: 'archivedAt must be on or after createdAt'
        })
      }
    }
  })
  return issues
}

/**
 * Compute duplicate name issues per parent (root treated as its own group).
 * Enforces case-insensitive uniqueness.
 */
export function computeDuplicateNameIssues(rows: CsvRow[]): RowIssue[] {
  const issues: RowIssue[] = []
  const seenByParent = new Map<string | null, Map<string, number>>() // parentId -> nameKey -> firstIndex

  rows.forEach((row, index) => {
    const parentKey = row.parentId
    const nameKey = row.name.trim().toLowerCase()

    let mapForParent = seenByParent.get(parentKey ?? null)
    if (!mapForParent) {
      mapForParent = new Map<string, number>()
      seenByParent.set(parentKey ?? null, mapForParent)
    }

    if (mapForParent.has(nameKey)) {
      issues.push({
        index,
        path: 'name',
        message:
          parentKey === null
            ? 'Duplicate root category name (root names must be unique)'
            : 'Duplicate category name under the same parent (names must be unique per parent)'
      })
      return
    }
    mapForParent.set(nameKey, index)
  })

  return issues
}
