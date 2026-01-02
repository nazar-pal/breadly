import {
  accounts,
  categories,
  currencies,
  transactionInsertSchema,
  transactions
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils'
import { db } from '@/system-v2'
import { and, eq, inArray } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'

type TransactionData = Omit<z.input<typeof transactionInsertSchema>, 'userId'>

/**
 * Creates multiple transactions in a single atomic operation.
 * Designed for bulk import where historical transactions may reference
 * now-archived categories and accounts.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints:
 *    - Amount is positive and within limits
 *    - Transfers have a source account (accountId not null)
 *    - Transfers have different source and destination accounts
 *    - Non-transfers don't have a counter account
 * 2. Transaction validates FK constraints and business rules:
 *    - Currency, category, and account references exist
 *    - Transfer transactions cannot have a category
 *    - Category type matches transaction type (expense→expense, income→income)
 *    - Currency matches account currency (prevents server trigger failure)
 *
 * Note: Unlike createTransaction, archived categories and accounts ARE allowed
 * since bulk import often includes historical transactions for archived entities.
 * Negative account balances are allowed (no insufficient funds check).
 */
export async function createManyTransactions({
  userId,
  data
}: {
  userId: string
  data: TransactionData[]
}) {
  if (data.length === 0) {
    return [new Error('No transactions to create'), null]
  }

  // Parse all rows upfront with Zod schema (same as createTransaction)
  const parsedRows: z.infer<typeof transactionInsertSchema>[] = []
  for (let i = 0; i < data.length; i++) {
    const parseResult = transactionInsertSchema.safeParse({
      ...data[i],
      userId
    })
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]
      return [new Error(`Row ${i + 1}: ${firstIssue.message}`), null]
    }
    // Ensure ID is present (Zod doesn't apply Drizzle's $defaultFn)
    const row = parseResult.data
    if (!row.id) row.id = randomUUID()
    parsedRows.push(row)
  }

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Collect all unique IDs we need to validate
      const currencyIds = new Set<string>()
      const categoryIds = new Set<string>()
      const accountIds = new Set<string>()

      for (const row of parsedRows) {
        currencyIds.add(row.currencyId)
        if (row.categoryId) categoryIds.add(row.categoryId)
        if (row.accountId) accountIds.add(row.accountId)
        if (row.counterAccountId) accountIds.add(row.counterAccountId)
      }

      // Load all referenced currencies (FK validation)
      const validCurrencies = await tx
        .select({ code: currencies.code })
        .from(currencies)
        .where(inArray(currencies.code, [...currencyIds]))
      const validCurrencyCodes = new Set(validCurrencies.map(c => c.code))

      // Load all referenced categories with types (FK validation + type matching)
      const validCategories =
        categoryIds.size > 0
          ? await tx
              .select({ id: categories.id, type: categories.type })
              .from(categories)
              .where(
                and(
                  eq(categories.userId, userId),
                  inArray(categories.id, [...categoryIds])
                )
              )
          : []
      const validCategoryIds = new Set(validCategories.map(c => c.id))
      const categoryTypes = new Map(validCategories.map(c => [c.id, c.type]))

      // Load all referenced accounts with balances and currencies (FK validation + balance tracking + currency validation)
      const accountsData =
        accountIds.size > 0
          ? await tx
              .select({
                id: accounts.id,
                balance: accounts.balance,
                currencyId: accounts.currencyId
              })
              .from(accounts)
              .where(
                and(
                  eq(accounts.userId, userId),
                  inArray(accounts.id, [...accountIds])
                )
              )
          : []

      // Track running balances and currencies for each account
      const accountBalances = new Map<string, number>()
      const accountCurrencies = new Map<string, string | null>()
      for (const acc of accountsData) {
        accountBalances.set(acc.id, acc.balance)
        accountCurrencies.set(acc.id, acc.currencyId)
      }

      // Validate all rows and update running balances
      for (let i = 0; i < parsedRows.length; i++) {
        const row = parsedRows[i]

        // Validate currency exists
        if (!validCurrencyCodes.has(row.currencyId)) {
          throw new Error(
            `Row ${i + 1}: Currency "${row.currencyId}" not found`
          )
        }

        // Transfer transactions cannot have a category (server trigger enforces this)
        if (row.type === 'transfer' && row.categoryId != null) {
          throw new Error(
            `Row ${i + 1}: Transfer transactions cannot have a category`
          )
        }

        // Validate category exists and type matches (if provided)
        if (row.categoryId) {
          if (!validCategoryIds.has(row.categoryId)) {
            throw new Error(`Row ${i + 1}: Category not found`)
          }

          // Validate category type matches transaction type (server trigger enforces this)
          const categoryType = categoryTypes.get(row.categoryId)
          if (categoryType && categoryType !== row.type) {
            throw new Error(
              `Row ${i + 1}: Cannot use ${categoryType} category for ${row.type} transaction`
            )
          }
        }

        // Validate accounts exist
        if (row.accountId && !accountBalances.has(row.accountId)) {
          throw new Error(`Row ${i + 1}: Account not found`)
        }
        if (
          row.counterAccountId &&
          !accountBalances.has(row.counterAccountId)
        ) {
          throw new Error(`Row ${i + 1}: Destination account not found`)
        }

        // Validate currency consistency (prevents server trigger failure)
        if (row.accountId) {
          const accountCurrency = accountCurrencies.get(row.accountId)
          if (accountCurrency && accountCurrency !== row.currencyId) {
            throw new Error(
              `Row ${i + 1}: Transaction currency (${row.currencyId}) does not match account currency (${accountCurrency})`
            )
          }
        }
        if (row.type === 'transfer' && row.counterAccountId) {
          const counterAccountCurrency = accountCurrencies.get(
            row.counterAccountId
          )
          if (
            counterAccountCurrency &&
            counterAccountCurrency !== row.currencyId
          ) {
            throw new Error(
              `Row ${i + 1}: Transfer currency (${row.currencyId}) does not match destination account currency (${counterAccountCurrency})`
            )
          }
        }

        // Get current running balances
        const fromBalance = row.accountId
          ? accountBalances.get(row.accountId)!
          : null
        const toBalance = row.counterAccountId
          ? accountBalances.get(row.counterAccountId)!
          : null

        // Update running balances (same logic as createTransaction)
        if (row.type === 'income' && row.accountId) {
          // For income, accountId is optional - update balance only if account is set
          accountBalances.set(row.accountId, fromBalance! + row.amount)
        } else if (row.type === 'expense' && row.accountId) {
          // For expense, accountId is optional - update balance only if account is set
          accountBalances.set(row.accountId, fromBalance! - row.amount)
        } else if (row.type === 'transfer') {
          // For transfers, Zod schema guarantees both accountId and counterAccountId exist
          accountBalances.set(row.accountId!, fromBalance! - row.amount)
          accountBalances.set(row.counterAccountId!, toBalance! + row.amount)
        }
      }

      // Insert all transactions in chunks to avoid SQLite variable limit
      const CHUNK_SIZE = 50
      for (let i = 0; i < parsedRows.length; i += CHUNK_SIZE) {
        const chunk = parsedRows.slice(i, i + CHUNK_SIZE)
        await tx.insert(transactions).values(chunk)
      }

      // Update all affected account balances
      for (const [accountId, newBalance] of accountBalances) {
        const originalBalance = accountsData.find(
          a => a.id === accountId
        )?.balance
        if (originalBalance !== newBalance) {
          await tx
            .update(accounts)
            .set({ balance: newBalance })
            .where(eq(accounts.id, accountId))
        }
      }

      return { inserted: parsedRows.length }
    })
  )

  return [error, result]
}
