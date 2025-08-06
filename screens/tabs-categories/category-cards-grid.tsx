import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Text } from '@/components/ui/text'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import {
  useCategoryViewStore,
  type CategoryViewType
} from '@/lib/storage/category-view-store'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'
import { CategoryCardExtended } from './category-card-extended'
import {
  useGetCategoriesWithAmounts,
  type CategoryWithAmounts
} from './lib/use-get-categories-with-amounts'

interface Props {
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const CHUNK_SIZE = 2
const ADD_BUTTON_SENTINEL = Symbol('ADD_BUTTON_SENTINEL')

function chunkArray<T>(array: T[], size = CHUNK_SIZE): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

// -----------------------------------------------------------------------------
// Internal components
// -----------------------------------------------------------------------------

interface CategoryGridSectionProps {
  data: CategoryWithAmounts[]
  includeAddButton?: boolean
  isArchived?: boolean
  viewType: CategoryViewType
  onPress: (id: string) => void
  onLongPress: (id: string) => void
}

function CategoryGridSection({
  data,
  includeAddButton = false,
  isArchived = false,
  viewType,
  onPress,
  onLongPress
}: CategoryGridSectionProps) {
  // Split items into pairs for a 2-column grid. We build the list inside
  const pairs = () => {
    const list: (CategoryWithAmounts | typeof ADD_BUTTON_SENTINEL)[] =
      includeAddButton ? [...data, ADD_BUTTON_SENTINEL] : data

    return chunkArray(list)
  }

  const CardComponent =
    viewType === 'extended' ? CategoryCardExtended : CategoryCard
  const cardClassName = isArchived
    ? 'rounded-2xl border border-dashed border-border bg-muted/50 p-3'
    : 'rounded-2xl border border-border bg-card p-3'

  return (
    <>
      {pairs().map((pair, pairIndex) => (
        <View key={pairIndex} className="mb-4 flex-row gap-4">
          {pair.map(item => {
            if (item === ADD_BUTTON_SENTINEL) {
              return (
                <View key="add-button" className="flex-1">
                  <ButtonAddCategory className="rounded-2xl border border-dashed border-border bg-muted/50 p-3" />
                </View>
              )
            }

            const category = item as CategoryWithAmounts

            return (
              <View key={category.id} className="flex-1">
                <CardComponent
                  category={category}
                  onPress={() => onPress(category.id)}
                  onLongPress={() => onLongPress(category.id)}
                  className={cardClassName}
                />
              </View>
            )
          })}

          {/* Spacer for uneven rows */}
          {pair.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </>
  )
}

// -----------------------------------------------------------------------------
// Public component
// -----------------------------------------------------------------------------

export function CategoryCardsGrid({ onPress, onLongPress }: Props) {
  const { dateRange } = useCategoriesDateRangeState()
  const { viewType } = useCategoryViewStore()

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
      {/* Active categories */}
      <CategoryGridSection
        data={categories}
        includeAddButton
        viewType={viewType}
        onPress={onPress}
        onLongPress={onLongPress}
      />

      {/* Archived categories */}
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
                <View className="pt-2">
                  <CategoryGridSection
                    data={categoriesArchived}
                    isArchived
                    viewType={viewType}
                    onPress={onPress}
                    onLongPress={onLongPress}
                  />
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      )}
    </ScrollView>
  )
}
