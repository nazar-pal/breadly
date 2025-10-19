import { currencies } from '@/data/client/db-schema'
import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'

export function useGetCurrency({ currencyCode }: { currencyCode: string }) {
  const query = db.query.currencies.findFirst({
    where: eq(currencies.code, currencyCode)
  })

  const result = useDrizzleQuery(query)

  return result
}
