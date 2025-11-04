import { AccountType } from '@/data/client/db-schema'
import { AccountDetails } from '@/data/client/queries/use-get-account'
import { AccountItem } from '@/data/client/queries/use-get-accounts'
import { type AccountFormData } from './schema'

type Account = AccountItem | AccountDetails

export function getDefaultValues(
  account: Account | null,
  accountType: AccountType
): Partial<AccountFormData> {
  return {
    name: account?.name,
    description: account?.description,
    balance: account?.balance,
    isArchived: account?.isArchived,
    currencyId: account?.currencyId,

    ...(accountType === 'saving'
      ? {
          savingsTargetAmount: account?.savingsTargetAmount,
          savingsTargetDate: account?.savingsTargetDate
        }
      : {}),

    ...(accountType === 'debt'
      ? {
          debtInitialAmount: account?.debtInitialAmount,
          debtIsOwedToMe: account?.debtIsOwedToMe,
          debtDueDate: account?.debtDueDate
        }
      : {})
  }
}
