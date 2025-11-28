import { categories } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'

interface Params {
  userId: string
  categoryId: string
}

export function getCategory({ userId, categoryId }: Params) {
  return db.query.categories.findFirst({
    where: and(eq(categories.userId, userId), eq(categories.id, categoryId)),
    with: { parent: true }
  })
}

export type GetCategoryResult = Awaited<ReturnType<typeof getCategory>>
export type GetCategoryResultItem = Exclude<GetCategoryResult, undefined>
