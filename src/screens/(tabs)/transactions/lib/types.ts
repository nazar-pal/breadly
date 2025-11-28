import type { getTransactions } from '@/data/client/queries'

export type Transaction = Awaited<ReturnType<typeof getTransactions>>[number]

export type ListItemType = 'header' | 'transaction' | 'empty'

export interface ListItem {
  type: ListItemType
  id: string
  title?: string
  transaction?: Transaction
}
