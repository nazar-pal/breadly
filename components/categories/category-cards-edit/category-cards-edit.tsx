import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/hooks'
import { useGetCategoriesForEdit } from '@/lib/powersync/data/queries'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useCategoryType } from '../lib/use-category-type'
import { ButtonAddCategory } from './button-add-category'
import { CategoryGroup } from './category-group'

interface Props {
  categoryType: 'income' | 'expense'
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
}

export function CategoryCardsEdit({ onPress, onLongPress }: Props) {
  const { userId } = useUserSession()
  const type = useCategoryType()

  const { data: categories } = useGetCategoriesForEdit({
    userId,
    type,
    isArchived: false
  })

  const { data: categoriesArchived } = useGetCategoriesForEdit({
    userId,
    type,
    isArchived: true
  })

  return (
    <ScrollView className="mt-4 flex-1">
      {/* Main categories grid */}
      <View className="flex-1 flex-col gap-4">
        {categories.map(categoryGroup => (
          <CategoryGroup
            key={categoryGroup.id}
            categoryGroup={categoryGroup}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        ))}

        <ButtonAddCategory className="rounded-2xl border border-dashed border-border bg-muted/50 p-3" />
      </View>

      {/* Archived categories accordion */}
      {categoriesArchived.length > 0 && (
        <View className="mt-6">
          <Accordion type="multiple" collapsible className="w-full">
            <AccordionItem value="archived-categories">
              <AccordionTrigger>
                <Text className="text-sm font-medium text-muted-foreground">
                  Archived Categories ({categoriesArchived.length})
                </Text>
              </AccordionTrigger>
              <AccordionContent>
                <View className="flex-1 flex-col gap-4 pt-2">
                  {categoriesArchived.map(categoryGroup => (
                    <CategoryGroup
                      key={categoryGroup.id}
                      categoryGroup={categoryGroup}
                      isArchived={true}
                      onPress={onPress}
                      onLongPress={onLongPress}
                    />
                  ))}
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      )}
    </ScrollView>
  )
}
