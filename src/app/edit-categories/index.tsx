import { CategoryType } from '@/data/client/db-schema'
import EditCategories, { LayoutHeaderRight } from '@/screens/edit-categories'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'

export default function EditCategoriesLayout() {
  const navigation = useNavigation()

  const params = useLocalSearchParams<{
    type: CategoryType
    archived: 'true' | 'false'
  }>()

  const title =
    params.archived === 'true'
      ? 'Edit Categories (Archived)'
      : 'Edit Categories'

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <LayoutHeaderRight archived={params.archived === 'true'} />
      )
    })
  }, [navigation, title, params.archived])

  return (
    <EditCategories type={params.type} archived={params.archived === 'true'} />
  )
}
