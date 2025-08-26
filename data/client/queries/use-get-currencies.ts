import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { asc } from 'drizzle-orm'
import { currencies } from '../db-schema'
import { db } from '../powersync/system'

export function useGetCurrencies() {
  const query = db.query.currencies.findMany({
    orderBy: [asc(currencies.name)]
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
