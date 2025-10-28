import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { asc } from 'drizzle-orm'
import { currencies } from '../db-schema'

export function useGetCurrencies() {
  const query = db.query.currencies.findMany({
    orderBy: [asc(currencies.name)]
  })

  const result = useDrizzleQuery(query)

  return result
}
