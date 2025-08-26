import { formatCurrency } from '@/lib/utils'
import { AccountDetails, AccountItem } from '../data'

type Account = AccountDetails | AccountItem

export function calculateAccountProgress(account: Account): number | null {
  const balanceAmount = account.balance || 0

  if (account.type === 'saving' && account.savingsTargetAmount) {
    const target = account.savingsTargetAmount
    if (target > 0) return Math.min((balanceAmount / target) * 100, 100)
  } else if (account.type === 'debt' && account.debtInitialAmount) {
    const initial = account.debtInitialAmount
    if (initial > 0) {
      const paid = initial - balanceAmount
      return Math.min(Math.max((paid / initial) * 100, 0), 100)
    }
  }

  return null
}

export function getAccountProgressLabel(account: Account): string | null {
  const currency = account.currencyId || 'USD'
  const balanceAmount = account.balance || 0

  if (account.type === 'saving' && account.savingsTargetAmount) {
    const targetAmount = account.savingsTargetAmount
    const current = formatCurrency(balanceAmount, currency)
    const target = formatCurrency(targetAmount, currency)
    return `${current} of ${target} saved`
  }

  if (account.type === 'debt' && account.debtInitialAmount) {
    const initialAmount = account.debtInitialAmount
    const paidAmount = initialAmount - balanceAmount
    const paid = formatCurrency(paidAmount, currency)
    const initial = formatCurrency(initialAmount, currency)
    return `${paid} of ${initial} paid`
  }

  return null
}
