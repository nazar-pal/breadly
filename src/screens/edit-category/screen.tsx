import { useGetCategory } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootCategory } from './components/root-category'
import { SubCategories } from './components/sub-categories'

export function Category({ categoryId }: { categoryId: string }) {
  const { userId } = useUserSession()

  const insets = useSafeAreaInsets()

  const { data, isLoading } = useGetCategory({ userId, categoryId })
  const category = data?.[0]

  if (isLoading || !category) return null

  return (
    <View
      className=" gap-4 bg-background px-4 pt-4"
      style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
    >
      <RootCategory category={category} />
      <SubCategories category={category} />
    </View>
  )
}
