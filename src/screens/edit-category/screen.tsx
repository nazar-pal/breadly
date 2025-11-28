import { getCategory } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootCategory } from './components/root-category'
import { SubCategories } from './components/sub-categories'

export default function Screen({ categoryId }: { categoryId: string }) {
  const { userId } = useUserSession()

  const insets = useSafeAreaInsets()

  const {
    data: [category],
    isLoading
  } = useDrizzleQuery(getCategory({ userId, categoryId }))

  if (isLoading || !category) return null

  return (
    <View
      className="bg-background gap-4 px-4 pt-4"
      style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
    >
      <RootCategory category={category} />
      <SubCategories category={category} />
    </View>
  )
}
