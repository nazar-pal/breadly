import { OperationListItem } from '@/components/operation-list-item'
import { LegendList } from '@legendapp/list'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { ListItem, Transaction } from '../lib/types'
import { EmptyTodayMessage, SectionHeader } from './index'
import { LoadingFooter } from './loading-footer'

interface TransactionListProps {
  todaysTransactions: Transaction[]
  earlierTransactions: Transaction[]
  onEndReached?: () => void
  isLoadingMore?: boolean
}

export function TransactionList({
  todaysTransactions,
  earlierTransactions,
  onEndReached,
  isLoadingMore
}: TransactionListProps) {
  const insets = useSafeAreaInsets()

  const listData = buildListData(todaysTransactions, earlierTransactions)

  return (
    <View className="bg-background flex-1">
      <LegendList
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 12, paddingTop: 12 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20
        }}
        recycleItems={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? LoadingFooter : undefined}
      />
    </View>
  )
}

function buildListData(
  todaysTransactions: Transaction[],
  earlierTransactions: Transaction[]
): ListItem[] {
  const data: ListItem[] = []

  // Today's section
  data.push({ type: 'header', id: 'today-header', title: 'Today' })

  if (todaysTransactions.length > 0) {
    todaysTransactions.forEach(tx => {
      data.push({ type: 'transaction', id: tx.id, transaction: tx })
    })
  } else {
    data.push({ type: 'empty', id: 'today-empty' })
  }

  // Earlier section
  if (earlierTransactions.length > 0) {
    data.push({ type: 'header', id: 'earlier-header', title: 'Earlier' })

    earlierTransactions.forEach(tx => {
      data.push({ type: 'transaction', id: tx.id, transaction: tx })
    })
  }

  return data
}

function renderItem({ item }: { item: ListItem }) {
  switch (item.type) {
    case 'header':
      return (
        <SectionHeader
          title={item.title!}
          isFirst={item.id === 'today-header'}
        />
      )

    case 'transaction':
      return item.transaction ? (
        <View className="mb-2">
          <OperationListItem operation={item.transaction} />
        </View>
      ) : null

    case 'empty':
      return <EmptyTodayMessage />

    default:
      return null
  }
}
