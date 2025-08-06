import { type IconName } from '@/components/icon'
import { CategoryInsertSQLite } from '@/lib/powersync/schema/table_4_categories'
import { AccountInsertSQLite } from '@/lib/powersync/schema/table_6_accounts'

// Default categories shown to first-time guests
interface CategoryInsertSQLiteWithoutUserId
  extends Omit<CategoryInsertSQLite, 'userId'> {
  icon: IconName
}

export const DEFAULT_CATEGORIES: readonly CategoryInsertSQLiteWithoutUserId[] =
  [
    // Expense categories
    { name: 'Food & Dining', icon: 'UtensilsCrossed', type: 'expense' },
    { name: 'Transportation', icon: 'Bus', type: 'expense' },
    { name: 'Shopping', icon: 'CreditCard', type: 'expense' },
    { name: 'Entertainment', icon: 'Film', type: 'expense' },
    { name: 'Bills & Utilities', icon: 'Receipt', type: 'expense' },
    { name: 'Healthcare', icon: 'Heart', type: 'expense' },
    { name: 'Education', icon: 'Briefcase', type: 'expense' },

    // Income categories
    { name: 'Salary', icon: 'Briefcase', type: 'income' },
    { name: 'Freelance', icon: 'DollarSign', type: 'income' },
    { name: 'Investment', icon: 'TrendingUp', type: 'income' },
    { name: 'Savings Interest', icon: 'PiggyBank', type: 'income' }
  ] as const

// Default starter accounts
interface AccountInsertSQLiteWithoutUserId
  extends Omit<AccountInsertSQLite, 'userId'> {}

export const DEFAULT_ACCOUNTS: readonly AccountInsertSQLiteWithoutUserId[] = [
  { name: 'Cash', type: 'payment', currencyId: 'USD' },
  { name: 'Checking Account', type: 'payment', currencyId: 'USD' },
  { name: 'Savings Account', type: 'saving', currencyId: 'USD' }
] as const
