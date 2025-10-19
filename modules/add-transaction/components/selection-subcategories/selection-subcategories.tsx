import React from 'react'
import { ScrollView } from 'react-native'
import { useTransactionParamsActions } from '../../store'
import { TransactionParams } from '../../types'
import { SubcategoriesItem } from './subcategories-item'
import { SubcategoriesListData } from './subcategories-list-data'

export function SelectionSubcategories({
  params
}: {
  params: Extract<TransactionParams, { type: 'expense' | 'income' }>
}) {
  const { categoryId, accountId, currencyCode, type } = params
  const { setExpenseIncomeParams } = useTransactionParamsActions()

  function setSelectedCategoryId(categoryId: string) {
    if (accountId !== undefined)
      setExpenseIncomeParams({ type, categoryId, accountId })
    else setExpenseIncomeParams({ type, categoryId, currencyCode })
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
      contentContainerStyle={{ gap: 8 }}
    >
      {categoryId && (
        <SubcategoriesListData
          selectedCategoryId={categoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      )}

      <SubcategoriesItem label="+ Add Subcategory" variant="muted-dashed" />
    </ScrollView>
  )
}
