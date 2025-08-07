/**
 * Calculates percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (positive for increase, negative for decrease)
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Calculates percentage of total
 * @param value - Part value
 * @param total - Total value
 * @returns Percentage of total
 */
export function calculatePercentageOfTotal(
  value: number,
  total: number
): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Calculates budget progress percentage
 * @param spent - Amount spent
 * @param budget - Budget amount
 * @returns Progress percentage (can exceed 100%)
 */
export function calculateBudgetProgress(spent: number, budget: number): number {
  if (budget <= 0) return 0
  return (spent / budget) * 100
}

/**
 * Calculates savings rate as percentage of income
 * @param income - Total income
 * @param expenses - Total expenses
 * @returns Savings rate percentage
 */
export function calculateSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0
  return ((income - expenses) / income) * 100
}
