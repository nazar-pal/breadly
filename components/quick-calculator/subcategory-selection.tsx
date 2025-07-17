import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/hooks'
import { useGetCategories } from '@/lib/powersync/data/queries'
import React from 'react'
import { Pressable, ScrollView } from 'react-native'
import { Badge } from '../ui/badge'

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

  if (subcategories.length === 0) return null

  return (
    <ScrollView
      className="w-full"
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}
      scrollEventThrottle={16}
      bounces={false}
      contentContainerStyle={{
        flexDirection: 'row',
        gap: 8,
        paddingRight: 16
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
    </ScrollView>
  )
}
