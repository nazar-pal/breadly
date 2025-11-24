import { allIconsKeys } from '@/components/ui/icon-by-name'
import { CATEGORY_TYPE } from '@/data/client/db-schema/table_4_categories'
import { StringCase, isoDateToDate, stringToBoolean } from '@/lib/utils'
import { z } from 'zod'

const trimStr = z.string().trim()

export const csvRowSchema = z.object({
  id: trimStr.min(1),
  parentId: trimStr.min(1).optional(),
  name: trimStr.min(3).max(100),
  type: trimStr.pipe(z.enum(CATEGORY_TYPE)).default('expense'),
  icon: trimStr
    .transform(iconName => StringCase.pascal(iconName))
    .pipe(z.enum(allIconsKeys))
    .default('Circle'),
  createdAt: trimStr.pipe(isoDateToDate),
  isArchived: trimStr.pipe(stringToBoolean).default(false),
  archivedAt: trimStr.pipe(isoDateToDate).optional()
})

export type CsvRow = z.infer<typeof csvRowSchema>
