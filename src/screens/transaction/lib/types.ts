import type { GetTransactionResultItem } from '@/data/client/queries/get-transaction'

export type Transaction = GetTransactionResultItem

export type TransactionAttachment = NonNullable<
  Transaction['transactionAttachments'][number]['attachment']
>
