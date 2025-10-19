import { TransactionType } from '@/data/client/db-schema'
import { DefinedProps } from '@/lib/types'

type TransferParams = {
  type: Extract<TransactionType, 'transfer'>
  fromAccountId: string | null
  toAccountId: string | null
  categoryId?: undefined
  currencyCode?: undefined
  accountId?: undefined
}

type ExpenseIncomeBase = {
  type: Extract<TransactionType, 'expense' | 'income'>
  categoryId: string | null
}

type ExpenseIncomeWithCurrency = ExpenseIncomeBase & {
  currencyCode: string | null
  accountId?: undefined
}

type ExpenseIncomeWithAccount = ExpenseIncomeBase & {
  accountId: string | null
  currencyCode?: undefined
}
type OptionalAccounts = { fromAccountId?: undefined; toAccountId?: undefined }

export type TransactionParams =
  | TransferParams
  | (ExpenseIncomeWithCurrency & OptionalAccounts)
  | (ExpenseIncomeWithAccount & OptionalAccounts)

export type SetTransferParams = DefinedProps<TransferParams>
export type SetExpenseIncomeParams = DefinedProps<
  ExpenseIncomeWithCurrency | ExpenseIncomeWithAccount
>

// Params selection Modal Tabs
export const directions = ['from', 'to'] as const
export type Direction = (typeof directions)[number]
export type TabKey = 'account' | 'currency' | 'category'
