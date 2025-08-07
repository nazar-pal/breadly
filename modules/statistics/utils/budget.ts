import { BudgetSelectSQLite } from '@/data/client/db-schema'
import { endOfMonth, startOfMonth } from 'date-fns'

/**
 * Gets the current month's budget for a category
 * @param budgets - Array of budgets for the category
 * @param referenceDate - Date to use for "current month" (defaults to now)
 * @returns Current month budget or null if none found
 */
export function getCurrentMonthBudget(
  budgets?: BudgetSelectSQLite[],
  referenceDate: Date = new Date()
): BudgetSelectSQLite | null {
  if (!budgets || budgets.length === 0) return null

  const currentMonthStart = startOfMonth(referenceDate)
  const currentMonthEnd = endOfMonth(referenceDate)

  return (
    budgets.find(budget => {
      const budgetStart = new Date(budget.startDate)
      const budgetEnd = new Date(budget.endDate)
      return budgetStart <= currentMonthEnd && budgetEnd >= currentMonthStart
    }) || null
  )
}

/**
 * Checks if spending is over budget
 * @param spent - Amount spent
 * @param budget - Budget amount
 * @returns True if over budget
 */
export function isOverBudget(spent: number, budget: number): boolean {
  return budget > 0 && spent > budget
}
