import { Text } from '@/components/ui/text'
import { LegendList } from '@legendapp/list'
import React, { type ReactNode } from 'react'
import { ActivityIndicator, View } from 'react-native'
import type { SelectableRowProps } from '../types'
import { SelectionItem } from './selection-item'

interface Props {
  emptyMessage: string
  data: SelectableRowProps[]
  columns?: 1 | 2
  isLoading?: boolean
}

export function SelectionList({
  data,
  emptyMessage,
  columns = 1,
  isLoading
}: Props) {
  if (isLoading) {
    return <LoadingMessage />
  }

  const gap = 12

  return (
    <LegendList
      data={data}
      renderItem={({ item }) => <SelectionItem {...item} />}
      keyExtractor={item => item.itemKey}
      ListEmptyComponent={<EmptyListMessage>{emptyMessage}</EmptyListMessage>}
      numColumns={columns}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={{
        paddingHorizontal: columns > 1 ? gap / 2 : 0
      }}
      contentContainerClassName="pb-safe-or-8"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  )
}

function EmptyListMessage({ children }: { children: ReactNode }) {
  return (
    <View className="items-center justify-center py-8">
      <Text className="text-muted-foreground text-sm">{children}</Text>
    </View>
  )
}

function LoadingMessage() {
  return (
    <View className="items-center justify-center py-8">
      <ActivityIndicator size="small" />
    </View>
  )
}
