import { AccountType } from '@/data/client/db-schema'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { GetAccountsResultItem } from '@/data/client/queries/get-accounts'
import { fromSmallestUnit } from '@/lib/utils/currency-info'
import { type AccountFormData } from './form-schemas'

type Account = GetAccountsResultItem | GetAccountResultItem

/**
 * Converts stored monetary integers to display amounts for form editing
 */
function getMonetaryDefaults(account: Account) {
  const { currencyId, balance, savingsTargetAmount, debtInitialAmount } =
    account

  return {
    balance: fromSmallestUnit(balance, currencyId),
    savingsTargetAmount:
      savingsTargetAmount != null
        ? fromSmallestUnit(savingsTargetAmount, currencyId)
        : undefined,
    debtInitialAmount:
      debtInitialAmount != null
        ? fromSmallestUnit(debtInitialAmount, currencyId)
        : undefined
  }
}

/**
 * Returns form default values for account create/update
 * For update: converts stored integers to display amounts
 * For create: returns empty defaults
 */
export function getDefaultValues(
  account: Account | null,
  accountType: AccountType
): Partial<AccountFormData> {
  // Create mode: return minimal defaults
  if (!account) return accountType === 'debt' ? { debtIsOwedToMe: true } : {}

  // Update mode: convert stored values to display format
  const monetary = getMonetaryDefaults(account)

  return {
    name: account.name,
    description: account.description,
    balance: monetary.balance,
    isArchived: account.isArchived,
    currencyId: account.currencyId,

    ...(accountType === 'saving'
      ? {
          savingsTargetAmount: monetary.savingsTargetAmount,
          savingsTargetDate: account.savingsTargetDate
        }
      : {}),

    ...(accountType === 'debt'
      ? {
          debtInitialAmount: monetary.debtInitialAmount,
          // Balance sign indicates debt direction
          debtIsOwedToMe: account.balance >= 0,
          debtDueDate: account.debtDueDate
        }
      : {})
  }
}
