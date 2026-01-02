import { getCategory } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system-v2/session'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useTransactionParamsActions } from '../../store'
import { TransactionParams } from '../../types'
import { AddSubcategoryDialog } from './add-subcategory-dialog'
import { SubcategoriesItem } from './subcategories-item'
import { SubcategoriesListData } from './subcategories-list-data'

export function SelectionSubcategories({
  params
}: {
  params: Extract<TransactionParams, { type: 'expense' | 'income' }>
}) {
  const { userId } = useUserSession()
  const { categoryId, accountId, currencyCode, type } = params
  const { setExpenseIncomeParams } = useTransactionParamsActions()
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Get the current category to determine parent info
  const {
    data: [selectedCategory]
  } = useDrizzleQuery(
    getCategory({
      userId,
      categoryId: categoryId ?? ''
    })
  )

  // Determine parent category info for creating subcategories
  // If current category has a parent, use the parent as the container
  // Otherwise, the current category itself is the parent (top-level category)
  const parentCategoryId = selectedCategory?.parentId ?? selectedCategory?.id
  const parentCategoryName =
    selectedCategory?.parent?.name ?? selectedCategory?.name ?? 'Category'

  function setSelectedCategoryId(newCategoryId: string) {
    if (accountId !== undefined)
      setExpenseIncomeParams({ type, categoryId: newCategoryId, accountId })
    else
      setExpenseIncomeParams({ type, categoryId: newCategoryId, currencyCode })
  }

  function handleSubcategoryCreated(subcategoryId: string) {
    // Automatically select the newly created subcategory
    setSelectedCategoryId(subcategoryId)
  }

  return (
    <>
      <ScrollView
        className="mb-2"
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {categoryId && (
          <SubcategoriesListData
            selectedCategoryId={categoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        )}

        <SubcategoriesItem
          label="+ Add Subcategory"
          variant="muted-dashed"
          onPress={() => setShowAddDialog(true)}
        />
      </ScrollView>

      {parentCategoryId && (
        <AddSubcategoryDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          parentCategoryId={parentCategoryId}
          parentCategoryName={parentCategoryName}
          categoryType={type}
          onSubcategoryCreated={handleSubcategoryCreated}
        />
      )}
    </>
  )
}
