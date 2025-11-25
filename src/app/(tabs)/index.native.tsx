import { CategoryType } from '@/data/client/db-schema'
import TabsCategoriesScreen, {
  SettingsDropdown
} from '@/screens/(tabs)/categories'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'

export default function CategoriesLayout() {
  const navigation = useNavigation()
  const params = useLocalSearchParams<{
    type?: CategoryType
  }>()

  const type = params.type === 'income' ? 'income' : 'expense'

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SettingsDropdown type={type} />
    })
  }, [navigation, type])

  return <TabsCategoriesScreen type={type} />
}
