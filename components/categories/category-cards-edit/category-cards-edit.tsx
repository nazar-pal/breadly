import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Text } from '@/components/ui/text'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useGetCategoriesWithAmounts } from '../lib/use-get-categories-with-amounts'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'

interface Props {
  categoryType: 'income' | 'expense'
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
}

export function CategoryCardsEdit({ onPress, onLongPress }: Props) {
  const { dateRange } = useCategoriesDateRangeState()

  const categories = useGetCategoriesWithAmounts({
    transactionsFrom: dateRange.start,
    transactionsTo: dateRange.end,
    isArchived: false
  })

  const categoriesArchived = useGetCategoriesWithAmounts({
    transactionsFrom: dateRange.start,
    transactionsTo: dateRange.end,
    isArchived: true
  })

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      {/* Main categories grid */}
      <View className="flex-1 flex-row flex-wrap gap-4">
        {categories.map(category => {
          return (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => onPress(category.id)}
              onLongPress={() => onLongPress(category.id)}
              className="w-[47%] rounded-2xl border border-border bg-card p-3"
            />
          )
        })}

        <ButtonAddCategory className="w-[47%] rounded-2xl border border-dashed border-border bg-muted/50 p-3" />
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
                <View className="flex-1 flex-row flex-wrap gap-4 pt-2">
                  {categoriesArchived.map(category => {
                    return (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onPress={() => onPress(category.id)}
                        onLongPress={() => onLongPress(category.id)}
                        className="w-[47%] rounded-2xl border border-dashed border-border bg-muted/50 p-3"
                      />
                    )
                  })}
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      )}
    </ScrollView>
  )
}
