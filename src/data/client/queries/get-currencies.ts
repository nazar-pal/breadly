import { db } from '@/system/powersync/system'
import { asc } from 'drizzle-orm'
import { currencies } from '../db-schema'

export function getCurrencies() {
  return db.query.currencies.findMany({
    orderBy: [asc(currencies.name)]
  })
}

export type GetCurrenciesResult = Awaited<ReturnType<typeof getCurrencies>>
export type GetCurrenciesResultItem = GetCurrenciesResult[number]
