import { ImportInstructionsDialog as ImportInstructionsDialogCategories } from '@/screens/import/categories'
import { ImportInstructionsDialog as ImportInstructionsDialogTransactions } from '@/screens/import/transactions'
import { Stack, useNavigation, usePathname } from 'expo-router'
import * as React from 'react'
import { useEffect } from 'react'
import 'react-native-reanimated'

export default function ImportLayout() {
  const navigation = useNavigation()
  const pathname = usePathname()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        pathname === '/import/categories' ? (
          <ImportInstructionsDialogCategories />
        ) : (
          <ImportInstructionsDialogTransactions />
        ),
      title:
        pathname === '/import/categories'
          ? 'Import Categories'
          : 'Import Transactions'
    })
  }, [navigation, pathname])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="categories" />
      <Stack.Screen name="transactions" />
    </Stack>
  )
}
