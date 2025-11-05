import { AccountType } from '@/data/client/db-schema'
import { AccountDetails } from '@/data/client/queries/use-get-account'
import { AccountItem } from '@/data/client/queries/use-get-accounts'
import { type AccountFormData } from './form-schemas'

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
          // Balance represents remaining debt. Default to owed-to-me when creating.
          debtIsOwedToMe:
            account?.balance != null
              ? account.balance >= 0
              : (account?.debtIsOwedToMe ?? true),
          debtDueDate: account?.debtDueDate
        }
      : {})
  }
}
