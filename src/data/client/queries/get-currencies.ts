import { currencies } from '@/data/client/db-schema'
import { db } from '@/system-v2'
import { asc } from 'drizzle-orm'

export function getCurrencies() {
  return db.query.currencies.findMany({
    orderBy: [asc(currencies.code)]
  })
}

export type GetCurrenciesResult = Awaited<ReturnType<typeof getCurrencies>>
export type GetCurrenciesResultItem = GetCurrenciesResult[number]
