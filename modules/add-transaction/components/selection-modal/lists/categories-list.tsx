import { useGetCategories } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { useTransactionParamsState } from '../../../store'
import { SelectionList } from '../primitives/selection-list'
import type { SelectableRowProps } from '../types'
import { mapCategoryToSelectableRow } from './row-mappers'

type CategoryListType = 'expense' | 'income'

interface Props {
  onSelect: (categoryId: string) => void
  listType: CategoryListType
}

export function CategoriesList({ onSelect, listType }: Props) {
  const { userId } = useUserSession()
  const params = useTransactionParamsState()

  const selectedCategoryId = params?.categoryId

  const { data: categories = [], isLoading } = useGetCategories({
    userId,
    type: listType,
    parentId: null,
    isArchived: false
  })

  const data: SelectableRowProps[] = categories.map(category =>
    mapCategoryToSelectableRow(category, selectedCategoryId, onSelect)
  )

  return (
    <SelectionList
      data={data}
      emptyMessage="No categories found"
      columns={2}
      isLoading={isLoading}
    />
  )
}
