import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { categories } from '../db-schema'

interface Params {
  userId: string
  categoryId: string
}

export function getCategory({ userId, categoryId }: Params) {
  return db.query.categories.findMany({
    where: and(eq(categories.userId, userId), eq(categories.id, categoryId)),
    limit: 1
  })
}

export type GetCategoryResult = Awaited<ReturnType<typeof getCategory>>
export type GetCategoryResultItem = GetCategoryResult[number]
