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

  return (
    <LegendList
      className="flex-1"
      data={data}
      renderItem={({ item }) => <SelectionItem {...item} />}
      keyExtractor={item => item.itemKey}
      ListEmptyComponent={<EmptyListMessage>{emptyMessage}</EmptyListMessage>}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? { gap: 8 } : undefined}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 12 }}
    />
  )
}

function EmptyListMessage({ children }: { children: ReactNode }) {
  return (
    <View className="items-center justify-center py-8">
      <Text className="text-sm text-muted-foreground">{children}</Text>
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
