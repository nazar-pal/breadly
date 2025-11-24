import ImportCategories, {
  ImportInstructionsDialog
} from '@/screens/import/categories'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'

export default function ImportCategoriesScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ImportInstructionsDialog />
    })
  }, [navigation])

  return <ImportCategories />
}
