import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Text } from '@/components/ui/text'
import { CategoryType } from '@/data/client/db-schema'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import { cn } from '@/lib/utils'
import React from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'
import { useArchivedCategoriesExpanded } from './lib/use-archived-categories-expanded'
import {
  useGetCategoriesWithAmounts,
  type CategoryWithAmounts
} from './lib/use-get-categories-with-amounts'

interface Props {
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
  type: CategoryType
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

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
  numColumns: number
  onPress: (id: string) => void
  onLongPress: (id: string) => void
  type: CategoryType
}

function CategoryGridSection({
  data,
  includeAddButton = false,
  isArchived = false,
  numColumns,
  onPress,
  onLongPress,
  type
}: CategoryGridSectionProps) {
  // Split items into pairs for a 2-column grid. We build the list inside
  const rows = () => {
    const list: (CategoryWithAmounts | typeof ADD_BUTTON_SENTINEL)[] =
      includeAddButton ? [...data, ADD_BUTTON_SENTINEL] : data

    return chunkArray(list, numColumns)
  }

  const CardComponent = CategoryCard
  const cardHeightPx = 56
  const cardHeightClass = 'h-full'

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
                    type={type}
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
                  onPress={() => {
                    if (!isArchived) onPress(category.id)
                  }}
                  onLongPress={() => onLongPress(category.id)}
                  className={cn(
                    'rounded-xl border border-border  bg-card p-3 shadow-sm',
                    cardHeightClass,
                    isArchived && 'border-dashed shadow-none'
                  )}
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

const ARCHIVED_ACCORDION_VALUE = 'archived-categories'

export function CategoryCardsGrid({ type, onPress, onLongPress }: Props) {
  const { dateRange } = useCategoriesDateRangeState()
  const { width } = useWindowDimensions()
  const { isExpanded, setExpanded } = useArchivedCategoriesExpanded()

  const categories = useGetCategoriesWithAmounts({
    transactionsFrom: dateRange.start,
    transactionsTo: dateRange.end,
    isArchived: false,
    type
  })

  const categoriesArchived = useGetCategoriesWithAmounts({
    transactionsFrom: dateRange.start,
    transactionsTo: dateRange.end,
    isArchived: true,
    type
  })

  // Compute how many columns we can fit per view type
  const horizontalPadding = 16 * 2 // from contentContainerStyle
  const availableWidth = Math.max(0, width - horizontalPadding)
  const minCardWidth = 152
  const numColumns = Math.max(2, Math.floor(availableWidth / minCardWidth))

  const accordionValue = isExpanded ? [ARCHIVED_ACCORDION_VALUE] : []

  const handleValueChange = (value: string[]) => {
    setExpanded(value.includes(ARCHIVED_ACCORDION_VALUE))
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 pb-2">
      {/* Active categories */}
      <CategoryGridSection
        data={categories}
        includeAddButton
        numColumns={numColumns}
        onPress={onPress}
        onLongPress={onLongPress}
        type={type}
      />

      {/* Archived categories */}
      {categoriesArchived.length > 0 && (
        <Accordion
          type="multiple"
          value={accordionValue}
          onValueChange={handleValueChange}
        >
          <AccordionItem
            value={ARCHIVED_ACCORDION_VALUE}
            className="border-b-0"
          >
            <AccordionTrigger>
              <Text className="text-sm font-medium text-muted-foreground">
                Archived Categories ({categoriesArchived.length})
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <CategoryGridSection
                data={categoriesArchived}
                isArchived
                numColumns={numColumns}
                onPress={onPress}
                onLongPress={onLongPress}
                type={type}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </ScrollView>
  )
}
