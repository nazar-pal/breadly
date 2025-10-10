import { CurrencySelectSQLite } from '@/data/client/db-schema'
import { DEFAULT_CURRENCIES } from '@/system/powersync/utils'

export const DEFAULT_CURRENCY: CurrencySelectSQLite =
  DEFAULT_CURRENCIES.find(c => c.code === 'USD') ?? DEFAULT_CURRENCIES[0]
