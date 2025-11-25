import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { currencies } from '../db-schema'

export function getCurrency({ currencyCode }: { currencyCode: string }) {
  return db.query.currencies.findMany({
    where: eq(currencies.code, currencyCode),
    limit: 1
  })
}

export type GetCurrencyResult = Awaited<ReturnType<typeof getCurrency>>
export type GetCurrencyResultItem = GetCurrencyResult[number]
