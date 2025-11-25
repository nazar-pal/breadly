import type { RowValidationError } from '@/lib/hooks/use-csv-import'
import { LegendList } from '@legendapp/list'
import React from 'react'
import { View } from 'react-native'
import type { CsvArr } from '../lib/csv-arr-schema'
import { getRowError } from '../lib/validate-import-rows'
import { PreviewRow } from './preview-row'

type PreviewListProps = {
  rows: CsvArr
  bottomPadding?: number
  validationErrors?: RowValidationError[]
}

export function PreviewList({
  rows,
  bottomPadding = 16,
  validationErrors = []
}: PreviewListProps) {
  const renderRow = ({
    item,
    index
  }: {
    item: CsvArr[number]
    index: number
  }) => {
    const error = getRowError(validationErrors, index)
    return <PreviewRow row={item} error={error} />
  }

  const ItemSeparator = () => <View style={{ height: 8 }} />

  return (
    <LegendList
      style={{ flex: 1 }}
      data={rows}
      renderItem={renderRow}
      keyExtractor={(_, index) => String(index)}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={70}
    />
  )
}
