import { trpc } from '@/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Text } from 'react-native'

const TestAuth = () => {
  const { data, isLoading, isError, error } = useQuery(
    trpc.appTest.testAuth.queryOptions()
  )

  if (isLoading) {
    return (
      <Text className="text-base text-green-600 dark:text-green-400">
        Loading authentication status...
      </Text>
    )
  }

  if (isError) {
    console.error('[TestAuth] Query error:', error)
    return (
      <Text className="text-base text-red-500 dark:text-red-400">
        Failed to authenticate: {error?.message || 'Network error'}
      </Text>
    )
  }

  return (
    <Text className="p-2 text-base text-blue-600 dark:text-blue-400">
      Authenticated User ID: {data?.userId || 'Not authenticated'}
    </Text>
  )
}

export default TestAuth
