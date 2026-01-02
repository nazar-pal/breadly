import { CategoryType } from '@/data/client/db-schema'
import { getCategoriesWithTransactions } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system-v2/session'
import React from 'react'
import { useTransactionParamsState } from '../../../store'
import { SelectionList } from '../primitives/selection-list'
import type { SelectableRowProps } from '../types'
import { mapCategoryToSelectableRow } from './row-mappers'

interface Props {
  onSelect: (categoryId: string) => void
  listType: CategoryType
}

export function CategoriesList({ onSelect, listType }: Props) {
  const { userId } = useUserSession()
  const params = useTransactionParamsState()

  const selectedCategoryId = params?.categoryId

  const { data: categories = [], isLoading } = useDrizzleQuery(
    getCategoriesWithTransactions({
      userId,
      type: listType,
      parentId: null,
      isArchived: false
    })
  )

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
