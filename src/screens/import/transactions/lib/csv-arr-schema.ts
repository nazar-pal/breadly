import { z } from 'zod'
import { csvRowSchema } from './csv-row-schema'

/**
 * Validate raw CSV rows and turn them into import-ready transaction rows.
 * Requires at least one valid row.
 */
export const csvSchema = z
  .array(csvRowSchema)
  .min(1, 'CSV file must contain at least one transaction row')

export type CsvArr = z.infer<typeof csvSchema>
