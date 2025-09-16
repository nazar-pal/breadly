import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { asc } from 'drizzle-orm'
import { currencies } from '../db-schema'

export function useGetCurrencies() {
  const query = db.query.currencies.findMany({
    orderBy: [asc(currencies.name)]
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
