import { useEffect, useState } from 'react'
import { getGuestDataStats } from '../powersync/data/migrations'
import { useUserSession } from './use-user-session'

type MigrationStats = {
  categories: number
  accounts: number
  transactions: number
  budgets: number
  attachments: number
  total: number
}

type UseMigrationPreviewReturn = {
  stats: MigrationStats | null
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

/**
 * Hook to get migration preview stats for guest users
 * Only fetches data when called and only for guest users
 */
export function useMigrationPreview(): UseMigrationPreviewReturn {
  const { isGuest, userId } = useUserSession()
  const [stats, setStats] = useState<MigrationStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = async () => {
    // Only fetch for guest users
    if (!isGuest) {
      setStats(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const migrationStats = await getGuestDataStats(userId)
      setStats(migrationStats)
    } catch (err) {
      console.error('Failed to fetch migration stats:', err)
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch migration stats')
      )
      setStats(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fetch on mount for guest users
  useEffect(() => {
    if (isGuest) {
      fetchStats()
    } else {
      // Clear data for authenticated users
      setStats(null)
      setError(null)
    }
  }, [isGuest, userId])

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats
  }
}

export type { MigrationStats, UseMigrationPreviewReturn }
