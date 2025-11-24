import { LegendList } from '@legendapp/list'
import React from 'react'
import { View } from 'react-native'
import type { CsvArr } from '../lib/csv-arr-schema'
import { PreviewRow } from './preview-row'

type PreviewListProps = {
  rows: CsvArr
  bottomPadding?: number
}

export function PreviewList({ rows, bottomPadding = 16 }: PreviewListProps) {
  const idToName = new Map<string, string>()
  rows.forEach(r => idToName.set(r.id, r.name))

  const renderRow = ({ item }: { item: CsvArr[number] }) => {
    const parentName =
      item.parentId != null ? idToName.get(item.parentId) : undefined
    return <PreviewRow row={item} parentName={parentName} />
  }

  const ItemSeparator = () => <View style={{ height: 8 }} />

  return (
    <LegendList
      style={{ flex: 1 }}
      data={rows}
      renderItem={renderRow}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={110}
    />
  )
}
