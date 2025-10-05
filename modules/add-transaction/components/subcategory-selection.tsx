import { Badge } from '@/components/ui/badge'
import { Text } from '@/components/ui/text'
import { useGetCategories } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { Pressable, ScrollView } from 'react-native'

export function SubcategorySelection({
  selectedParentCategoryId,
  selectedCategoryId,
  setSelectedCategoryId,
  type
}: {
  selectedParentCategoryId: string
  selectedCategoryId: string
  setSelectedCategoryId: (value: React.SetStateAction<string>) => void
  type: 'expense' | 'income'
}) {
  const { userId } = useUserSession()

  const { data: subcategories = [] } = useGetCategories({
    userId,
    parentId: selectedParentCategoryId,
    type
  })

  const handleSubcategorySelect = (subcategoryId: string) => {
    // Toggle subcategory selection - if already selected, deselect it
    if (selectedCategoryId === subcategoryId) {
      // Deselect subcategory and use parent category instead
      setSelectedCategoryId(selectedParentCategoryId)
    } else {
      // Select the subcategory
      setSelectedCategoryId(subcategoryId)
    }
  }

  return (
    <ScrollView
      className="mb-2"
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}
      scrollEventThrottle={16}
      bounces={false}
      contentContainerStyle={{
        gap: 8
      }}
    >
      {subcategories.map(subcategory => {
        const isSelected = selectedCategoryId === subcategory.id
        return (
          <Badge
            key={subcategory.id}
            asChild
            className={`${
              isSelected ? 'bg-primary' : 'border-foreground/15 bg-background'
            }`}
          >
            <Pressable onPress={() => handleSubcategorySelect(subcategory.id)}>
              <Text
                className={`text-sm ${
                  isSelected ? 'text-primary-foreground' : 'text-foreground'
                }`}
              >
                {subcategory.name}
              </Text>
            </Pressable>
          </Badge>
        )
      })}

      <Badge
        asChild
        className={`${'border-dashed border-muted-foreground/50 bg-background'}`}
      >
        <Pressable>
          <Text className="text-sm text-muted-foreground">
            + Add Subcategory
          </Text>
        </Pressable>
      </Badge>
    </ScrollView>
  )
}
