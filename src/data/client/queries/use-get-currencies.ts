import { useDrizzleQuery } from '@/lib/hooks'
import { getCurrencies } from './get-currencies'

export function useGetCurrencies() {
  const query = getCurrencies()

  const result = useDrizzleQuery(query)

  return result
}
