import { useDrizzleQuery } from '@/lib/hooks'
import { getUserPreferences } from './get-user-preferences'

export function useGetUserPreferences({ userId }: { userId: string }) {
  const query = getUserPreferences({ userId })

  const result = useDrizzleQuery(query)

  return result
}
