import { CurrencySelectSQLite } from '@/data/client/db-schema'

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

export const DEFAULT_CURRENCY: CurrencySelectSQLite =
  DEFAULT_CURRENCIES.find(c => c.code === 'USD') ?? DEFAULT_CURRENCIES[0]
