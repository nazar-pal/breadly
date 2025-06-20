import { asyncTryCatch } from '@/utils'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { db } from '../system'
import { categories } from './../schema/table_4_categories'
import { accounts } from './../schema/table_6_accounts'

// -------------------- Category Mutations --------------------

const categoryInsertSchema = createInsertSchema(categories)

export async function createCategory({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof categoryInsertSchema>, 'userId'>
}) {
  const parsedData = categoryInsertSchema.parse({ ...data, userId })

  const [error, result] = await asyncTryCatch(
    db.insert(categories).values(parsedData)
  )

  return [error, result]
}

// ------------------------------------------------------------------------------------------------

const categoryUpdateSchema = createUpdateSchema(categories).pick({
  parentId: true,
  name: true,
  description: true,
  icon: true,
  isArchived: true
})

export async function updateCategory({
  id,
  userId,
  data
}: {
  id: string
  userId: string
  data: z.input<typeof categoryUpdateSchema>
}) {
  const parsedData = categoryUpdateSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db
      .update(categories)
      .set(parsedData)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
  )

  return [error, result]
}

// ------------------------------------------------------------------------------------------------

export async function deleteCategory({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  const [error, result] = await asyncTryCatch(
    db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
  )

  return [error, result]
}

// -------------------- Account Mutations --------------------

const accountInsertSchema = createInsertSchema(accounts)

export async function createAccount({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof accountInsertSchema>, 'userId'>
}) {
  const parsedData = accountInsertSchema.parse({ ...data, userId })

  const [error, result] = await asyncTryCatch(
    db.insert(accounts).values(parsedData)
  )

  return [error, result]
}

// ------------------------------------------------------------------------------------------------

const accountUpdateSchema = createUpdateSchema(accounts).pick({
  name: true,
  description: true,
  balance: true,
  isArchived: true,
  savingsTargetAmount: true,
  savingsTargetDate: true,
  debtIsOwedToMe: true,
  debtDueDate: true
})

export async function updateAccount({
  id,
  userId,
  data
}: {
  id: string
  userId: string
  data: z.input<typeof accountUpdateSchema>
}) {
  const parsedData = accountUpdateSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db
      .update(accounts)
      .set(parsedData)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
  )

  return [error, result]
}

// ------------------------------------------------------------------------------------------------

export async function deleteAccount({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  const [error, result] = await asyncTryCatch(
    db
      .delete(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
  )

  return [error, result]
}
