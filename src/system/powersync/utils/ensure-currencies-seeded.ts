import { currencies, type CurrencySelectSQLite } from '@/data/client/db-schema'
import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { db } from '@/system/powersync/system'
import { count } from 'drizzle-orm'

export const DEFAULT_CURRENCIES: Pick<
  CurrencySelectSQLite,
  'id' | 'code' | 'symbol' | 'name'
>[] = [
  { id: 'AUD', code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { id: 'CAD', code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { id: 'CHF', code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { id: 'CNY', code: 'CNY', symbol: '¥', name: 'Chinese Yuan Renminbi' },
  { id: 'EUR', code: 'EUR', symbol: '€', name: 'Euro' },
  { id: 'GBP', code: 'GBP', symbol: '£', name: 'British Pound' },
  { id: 'INR', code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { id: 'JPY', code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { id: 'SGD', code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { id: 'UAH', code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { id: 'USD', code: 'USD', symbol: '$', name: 'US Dollar' }
] as const

export async function ensureCurrenciesSeeded(): Promise<void> {
  // Safety: only seed in local-only mode. When sync is enabled, the server
  // provides currencies, and any local seeding would be incorrect.
  if (sessionPersistentStore.getState().syncEnabled) return

  const [{ count: existingCount }] = await db
    .select({ count: count() })
    .from(currencies)

  if (existingCount > 0) return

  await db.insert(currencies).values(DEFAULT_CURRENCIES)
}
