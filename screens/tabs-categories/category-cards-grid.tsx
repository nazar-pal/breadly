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
import { ScrollView, useWindowDimensions, View } from 'react-native'
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

const COMPACT_MIN_CARD_WIDTH = 152 // px including paddings
const EXTENDED_MIN_CARD_WIDTH = 180
const ADD_BUTTON_SENTINEL = Symbol('ADD_BUTTON_SENTINEL')

function chunkArray<T>(array: T[], size: number): T[][] {
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
  numColumns: number
  onPress: (id: string) => void
  onLongPress: (id: string) => void
}

function CategoryGridSection({
  data,
  includeAddButton = false,
  isArchived = false,
  viewType,
  numColumns,
  onPress,
  onLongPress
}: CategoryGridSectionProps) {
  // Split items into pairs for a 2-column grid. We build the list inside
  const rows = () => {
    const list: (CategoryWithAmounts | typeof ADD_BUTTON_SENTINEL)[] =
      includeAddButton ? [...data, ADD_BUTTON_SENTINEL] : data

    return chunkArray(list, numColumns)
  }

  const CardComponent =
    viewType === 'extended' ? CategoryCardExtended : CategoryCard
  const cardHeightPx = viewType === 'extended' ? 112 : 56
  const cardHeightClass = 'h-full'
  const cardClassName = isArchived
    ? `rounded-xl border border-dashed border-border bg-muted/50 p-3 shadow-sm ${cardHeightClass}`
    : `rounded-xl border border-border bg-card p-3 shadow-sm ${cardHeightClass}`

  return (
    <>
      {rows().map((row, rowIndex) => (
        <View key={rowIndex} className="mb-3 flex-row items-stretch gap-3">
          {row.map(item => {
            if (item === ADD_BUTTON_SENTINEL) {
              return (
                <View
                  key="add-button"
                  className="flex-1"
                  style={{ height: cardHeightPx }}
                >
                  <ButtonAddCategory
                    className={`rounded-xl border border-dashed border-border bg-muted/50 p-3 shadow-sm ${cardHeightClass}`}
                  />
                </View>
              )
            }

            const category = item as CategoryWithAmounts

            return (
              <View
                key={category.id}
                className="flex-1"
                style={{ height: cardHeightPx }}
              >
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
          {row.length < numColumns && (
            <View style={{ flex: numColumns - row.length }} />
          )}
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
  const { width } = useWindowDimensions()

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

  // Compute how many columns we can fit per view type
  const horizontalPadding = 16 * 2 // from contentContainerStyle
  const availableWidth = Math.max(0, width - horizontalPadding)
  const minCardWidth =
    viewType === 'compact' ? COMPACT_MIN_CARD_WIDTH : EXTENDED_MIN_CARD_WIDTH
  const numColumns = Math.max(2, Math.floor(availableWidth / minCardWidth))

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      {/* Active categories */}
      <CategoryGridSection
        data={categories}
        includeAddButton
        viewType={viewType}
        numColumns={numColumns}
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
                    numColumns={numColumns}
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
