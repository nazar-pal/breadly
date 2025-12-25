import { currencies } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'

interface Params {
  currencyCode: string
}

export function getCurrency({ currencyCode }: Params) {
  return db.query.currencies.findFirst({
    where: eq(currencies.code, currencyCode)
  })
}

export type GetCurrencyResult = Awaited<ReturnType<typeof getCurrency>>
export type GetCurrencyResultItem = Exclude<GetCurrencyResult, undefined>
