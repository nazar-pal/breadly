import { currencies, sqliteSchema } from '@/data/client/db-schema'
import { DEFAULT_CURRENCIES } from '@/lib/constants'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { count } from 'drizzle-orm'

export async function ensureCurrenciesSeeded(
  powersync: AbstractPowerSyncDatabase
): Promise<void> {
  // Create a local Drizzle wrapper for the provided PowerSync instance.
  // This allows the function to work with any PowerSync database (for testability)
  // rather than being coupled to the global singleton.
  const db = wrapPowerSyncWithDrizzle(powersync, { schema: sqliteSchema })

  const [{ count: existingCount }] = await db
    .select({ count: count() })
    .from(currencies)
    .limit(1)

  if (existingCount > 0) return

  await db.insert(currencies).values(DEFAULT_CURRENCIES)
}
