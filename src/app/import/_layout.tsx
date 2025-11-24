import { ImportInstructionsDialog } from '@/screens/import-categories'
import { Stack, useNavigation } from 'expo-router'
import * as React from 'react'
import 'react-native-reanimated'

export default function ImportLayout() {
  const navigation = useNavigation()

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ImportInstructionsDialog />
    })
  }, [navigation])

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="categories"
        options={{ title: 'Import Categories' }}
      />
    </Stack>
  )
}
