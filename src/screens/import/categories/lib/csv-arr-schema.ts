import { env } from '@/env'
import { z } from 'zod'
import { csvRowSchema } from './csv-row-schema'
import {
  computeArchivedFieldIssues,
  computeDuplicateCsvIdIssues,
  computeDuplicateNameIssues,
  computeParentIdValidationIssues,
  computeSingleLevelHierarchyIssues
} from './refine-utils'
import {
  assignSortOrders,
  mapCsvIdsToDbIds,
  preorderByParent
} from './transform-utils'

type CsvRowInput = z.infer<typeof csvRowSchema>

function addCsvValidationIssues(rows: CsvRowInput[], ctx: z.RefinementCtx) {
  const issues = [
    ...computeDuplicateCsvIdIssues(rows),
    ...computeParentIdValidationIssues(rows),
    ...computeSingleLevelHierarchyIssues(rows),
    ...computeArchivedFieldIssues(rows),
    ...computeDuplicateNameIssues(rows)
  ]

  for (const { index, path, message } of issues) {
    ctx.addIssue({ code: 'custom', path: [index, path], message })
  }
}

function transformCsvRows(rows: CsvRowInput[]) {
  const rowsWithDbIds = mapCsvIdsToDbIds(rows)
  const sortedRows = preorderByParent(rowsWithDbIds)

  return assignSortOrders(sortedRows, env.EXPO_PUBLIC_SORT_ORDER_INCREMENT)
}

/**
 * Validate raw CSV rows and turn them into DB-ready category rows.
 */
export const csvSchema = z
  .array(csvRowSchema)
  .superRefine(addCsvValidationIssues)
  .transform(transformCsvRows)

export type CsvArr = z.infer<typeof csvSchema>
