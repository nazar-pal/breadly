import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import {
  useEditCategoriesActions,
  useEditCategoriesState
} from '@/lib/storage/edit-categories-store'
import { router, Stack } from 'expo-router'
import React from 'react'

export default function EditCategoryLayout() {
  const { showArchived } = useEditCategoriesState()
  const { toggleArchive } = useEditCategoriesActions()

  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <Icon name="ArrowLeft" size={24} className="text-foreground" />
          </Button>
        )
      }}
    >
      <Stack.Screen
        name="(main)"
        options={{
          title: showArchived
            ? 'Edit Categories (Archived)'
            : 'Edit Categories',
          headerRight: () => (
            <Button variant="ghost" size="icon" onPress={toggleArchive}>
              {showArchived ? (
                <Icon
                  name="ArchiveRestore"
                  size={24}
                  className="text-foreground"
                />
              ) : (
                <Icon name="Archive" size={24} className="text-foreground" />
              )}
            </Button>
          )
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Edit Category',
          animation: 'none'
        }}
      />
    </Stack>
  )
}
