import { currencies } from '@/data/client/db-schema'
import { DEFAULT_CURRENCIES } from '@/lib/constants'
import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { db } from '@/system/powersync/system'
import { count } from 'drizzle-orm'

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
