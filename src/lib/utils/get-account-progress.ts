import { AccountSelectSQLite } from '@/data/client/db-schema'
import { formatCurrency } from '@/lib/utils'

type Account = Pick<
  AccountSelectSQLite,
  | 'type'
  | 'savingsTargetAmount'
  | 'debtInitialAmount'
  | 'debtIsOwedToMe'
  | 'balance'
  | 'currencyId'
>

function getTarget(account: Account): number | null {
  if (account.type === 'saving' && account.savingsTargetAmount)
    return account.savingsTargetAmount

  if (account.type === 'debt' && account.debtInitialAmount)
    return account.debtInitialAmount

  return null
}

function calculateProgress(account: Account): number | null {
  const target = getTarget(account)
  if (!target || target <= 0) return null

  const balance = account.balance

  if (account.type === 'saving') return Math.min((balance / target) * 100, 100)

  if (account.type === 'debt') {
    // For debt accounts, balance represents the amount paid/received so far
    // Progress = (amount paid/received / initial debt) * 100
    return Math.min(Math.max((balance / target) * 100, 0), 100)
  }

  return null
}

function formatLabel(account: Account): string | null {
  const target = getTarget(account)
  if (!target || target <= 0) return null

  const balance = account.balance
  const currency = account.currencyId

  if (account.type === 'saving')
    return `${formatCurrency(balance, currency)} of ${formatCurrency(target, currency)} saved`

  if (account.type === 'debt') {
    // For debt accounts, balance represents the amount paid/received so far
    const isReceivable = Boolean(account.debtIsOwedToMe)
    const verb = isReceivable ? 'received' : 'paid'
    return `${formatCurrency(balance, currency)} of ${formatCurrency(target, currency)} ${verb}`
  }

  return null
}

export function getAccountProgress(account: Account): {
  label: string | null
  value: number | null
} {
  if (account.type === 'payment') return { label: null, value: null }

  return {
    label: formatLabel(account),
    value: calculateProgress(account)
  }
}
