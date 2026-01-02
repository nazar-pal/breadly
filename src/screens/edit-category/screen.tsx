import { getCategory } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system-v2/session'
import React from 'react'
import { View } from 'react-native'
import { RootCategory } from './components/root-category'
import { SubCategories } from './components/sub-categories'

export default function Screen({ categoryId }: { categoryId: string }) {
  const { userId } = useUserSession()

  const {
    data: [category],
    isLoading
  } = useDrizzleQuery(getCategory({ userId, categoryId }))

  if (isLoading || !category) return null

  return (
    <View className="bg-background pb-safe-offset-4 gap-4 px-4 pt-4">
      <RootCategory category={category} />
      <SubCategories category={category} />
    </View>
  )
}
