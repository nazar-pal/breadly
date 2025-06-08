import { trpc } from '@/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Text } from 'react-native'

const TestAuth = () => {
  const { data, isLoading, isError } = useQuery(
    trpc.appTest.testAuth.queryOptions()
  )

  if (isLoading) {
    return <Text>Loading authentication status...</Text>
  }

  if (isError) {
    return <Text style={{ color: 'red' }}>Failed to authenticate</Text>
  }

  return (
    <Text style={{ padding: 10, color: 'green' }}>
      Authenticated User ID: {data?.userId || 'Not authenticated'}
    </Text>
  )
}

export default TestAuth
