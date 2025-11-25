import { AccountType } from '@/data/client/db-schema'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { GetAccountsResultItem } from '@/data/client/queries/get-accounts'
import { type AccountFormData } from './form-schemas'

type Account = GetAccountsResultItem | GetAccountResultItem

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
          // Balance represents remaining debt. Default to owed-to-me when creating.
          debtIsOwedToMe:
            account?.balance != null ? account.balance >= 0 : true,
          debtDueDate: account?.debtDueDate
        }
      : {})
  }
}
