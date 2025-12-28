import { cn, toDateString } from '@/lib/utils'
import { LegendList } from '@legendapp/list'
import { startOfToday } from 'date-fns'
import React from 'react'
import { View, useColorScheme } from 'react-native'
import type { DateGroup, ListItem } from '../lib/types'
import { EmptyTodayMessage, SectionHeader } from './index'
import { LoadingFooter } from './loading-footer'
import { TransactionItem } from './transaction-item'

interface TransactionListProps {
  dateGroups: DateGroup[]
  onEndReached?: () => void
  isLoadingMore?: boolean
}

export function TransactionList({
  dateGroups,
  onEndReached,
  isLoadingMore
}: TransactionListProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const listData = buildListData(dateGroups)

  return (
    <View className={cn('flex-1', isDark ? 'bg-background' : 'bg-background')}>
      <LegendList
        data={listData}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 12, paddingTop: 12 }}
        contentContainerClassName="pb-safe-offset-4"
        recycleItems={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? LoadingFooter : undefined}
      />
    </View>
  )
}

function buildListData(dateGroups: DateGroup[]): ListItem[] {
  const data: ListItem[] = []

  // If no groups, show Today with empty message
  if (dateGroups.length === 0) {
    data.push({ type: 'header', id: 'today-header', title: 'Today' })
    data.push({ type: 'empty', id: 'today-empty' })
    return data
  }

  // Check if today has any transactions
  const todayKey = toDateString(startOfToday())
  const hasTodayGroup = dateGroups.some(g => g.key === todayKey)

  // If no today group, add empty today section first
  if (!hasTodayGroup) {
    data.push({ type: 'header', id: 'today-header', title: 'Today' })
    data.push({ type: 'empty', id: 'today-empty' })
  }

  // Add each date group
  dateGroups.forEach(group => {
    data.push({
      type: 'header',
      id: `header-${group.key}`,
      title: group.label,
      count: group.transactions.length
    })

    group.transactions.forEach(tx => {
      data.push({ type: 'transaction', id: tx.id, transaction: tx })
    })
  })

  return data
}

function RenderItem({ item }: { item: ListItem }) {
  switch (item.type) {
    case 'header':
      const todayKey = toDateString(startOfToday())
      const isFirstSection =
        item.id === 'today-header' || item.id.includes(todayKey)
      return (
        <SectionHeader
          title={item.title!}
          isFirst={isFirstSection}
          count={item.count}
        />
      )

    case 'transaction':
      return item.transaction ? (
        <TransactionItem transaction={item.transaction} />
      ) : null

    case 'empty':
      return <EmptyTodayMessage />

    default:
      return null
  }
}
