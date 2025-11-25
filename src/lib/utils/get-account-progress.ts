import { AccountSelectSQLite } from '@/data/client/db-schema'
import { formatCurrency } from '@/lib/utils'

type Account = Pick<
  AccountSelectSQLite,
  | 'type'
  | 'savingsTargetAmount'
  | 'debtInitialAmount'
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
    // For debt accounts, balance represents the remaining debt:
    // - Negative balance = you owe (remaining debt)
    // - Positive balance = someone owes you (remaining debt)
    // Amount paid/received = initial debt - remaining debt
    const remainingDebt = Math.abs(balance)
    const amountPaidOrReceived = target - remainingDebt

    // Progress = (amount paid/received / initial debt) * 100
    return Math.min(Math.max((amountPaidOrReceived / target) * 100, 0), 100)
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
    // Balance represents remaining debt:
    // - Positive balance = someone owes you (remaining debt)
    // - Negative balance = you owe someone (remaining debt)
    const isReceivable = account.balance > 0
    const verb = isReceivable ? 'received' : 'paid'

    // Calculate amount paid/received: initial debt - remaining debt
    const remainingDebt = Math.abs(balance)
    const amountPaidOrReceived = target - remainingDebt

    return `${formatCurrency(amountPaidOrReceived, currency)} of ${formatCurrency(target, currency)} ${verb}`
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
