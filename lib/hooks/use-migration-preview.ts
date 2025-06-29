import { useEffect, useState } from 'react'
import { getGuestDataStats } from '../powersync/data/migrations'
import { useUserSession } from './use-user-session'

export type MigrationStats = {
  categories: number
  accounts: number
  transactions: number
  budgets: number
  attachments: number
  total: number
}

export type UseMigrationPreviewReturn = {
  stats: MigrationStats | null
  isLoading: boolean
  error: Error | null
}

export function useMigrationPreview(): UseMigrationPreviewReturn {
  const { isGuest, userId } = useUserSession()
  const [stats, setStats] = useState<MigrationStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isGuest) return

    let cancelled = false

    setStats(null)
    setIsLoading(true)
    setError(null)

    getGuestDataStats(userId)
      .then(data => {
        if (!cancelled) {
          setStats(data)
          setIsLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to fetch migration stats')
          )
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isGuest, userId])

  return { stats, isLoading, error }
}
