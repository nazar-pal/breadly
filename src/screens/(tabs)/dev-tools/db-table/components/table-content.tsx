import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { LegendList } from '@legendapp/list'
import { useQuery } from '@powersync/react-native'
import { BlurView } from 'expo-blur'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Pressable,
  useColorScheme,
  View
} from 'react-native'
import { z } from 'zod'
import { escapeIdent, type SortOrder } from '../lib'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { InvalidParams } from './invalid-params'
import { RowCard } from './row-card'
import { SortControls } from './sort-controls'
import { StatsBar } from './stats-bar'

const ParamsSchema = z.object({
  slug: z.tuple([
    z.enum(['view', 'table']),
    z.string().min(1, 'Second parameter must be a non-empty string')
  ])
})

const SCROLL_THRESHOLD = 300
const SCROLL_TOP_HIDE_DELAY = 2500

export function TableContent() {
  const rawParams = useLocalSearchParams()
  const parseResult = ParamsSchema.safeParse(rawParams)

  if (!parseResult.success) {
    return (
      <InvalidParams
        message={parseResult.error.message || 'Invalid parameters'}
      />
    )
  }

  const { slug } = parseResult.data
  const [type, name] = slug

  return <TableData type={type} name={name} />
}

function TableData({ type, name }: { type: 'table' | 'view'; name: string }) {
  const safeIdent = escapeIdent(name)
  const listRef = useRef<any>(null)
  const lastScrollY = useRef(0)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Animation for scroll-to-top button
  const scrollTopAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(scrollTopAnim, {
      toValue: showScrollTop ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8
    }).start()
  }, [showScrollTop, scrollTopAnim])

  // Get column info
  const { data: columnInfo, isLoading: columnsLoading } = useQuery(
    `PRAGMA table_info(${safeIdent})`
  )

  const columnNames: string[] = (columnInfo ?? []).map((c: any) => c.name)

  // Get all data (no pagination - dev tools can handle it)
  const orderByClause = sortColumn
    ? `ORDER BY ${escapeIdent(sortColumn)} ${sortOrder.toUpperCase()}`
    : ''

  const {
    data: allData,
    isLoading: dataLoading,
    isFetching: dataFetching,
    error
  } = useQuery(`SELECT * FROM ${safeIdent} ${orderByClause}`, [], {
    runQueryOnce: false
  })

  const isLoading = columnsLoading || dataLoading
  const isRefreshing = dataFetching
  const columns = allData?.[0] ? Object.keys(allData[0]) : columnNames
  const totalRows = allData?.length ?? 0

  const handleSortColumnChange = (column: string | undefined) => {
    setSortColumn(column)
  }

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const layoutHeight = event.nativeEvent.layoutMeasurement.height
    const isScrollingUp = currentY < lastScrollY.current
    const isNearBottom = currentY + layoutHeight > contentHeight - 200
    const isPastThreshold = currentY > SCROLL_THRESHOLD

    // Show button when: scrolling up while past threshold, or near bottom
    if (isPastThreshold && (isScrollingUp || isNearBottom)) {
      setShowScrollTop(true)

      // Clear existing timeout
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

      // Auto-hide after delay (unless near bottom)
      if (!isNearBottom) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowScrollTop(false)
        }, SCROLL_TOP_HIDE_DELAY)
      }
    } else if (currentY <= SCROLL_THRESHOLD) {
      // Hide when scrolled to top
      setShowScrollTop(false)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }

    lastScrollY.current = currentY
  }

  const scrollToTop = () => {
    listRef.current?.scrollToOffset?.({ offset: 0, animated: true })
    setShowScrollTop(false)
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 px-4 py-3">
        <FloatingBackButton type={type} name={name} />
        <View className="mt-12">
          <ErrorState message={error?.message || 'Something went wrong.'} />
        </View>
      </View>
    )
  }

  if (totalRows === 0) {
    return (
      <View className="flex-1 px-4 py-3">
        <FloatingBackButton type={type} name={name} />
        <View className="mt-12">
          <SortControls
            columns={columnNames}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSortColumnChange={handleSortColumnChange}
            onSortOrderToggle={() =>
              setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
            }
          />
          <StatsBar columns={columns} totalRows={0} />
          <EmptyState />
        </View>
      </View>
    )
  }

  return (
    <View className={`flex-1 ${isRefreshing ? 'opacity-60' : ''}`}>
      {/* Scrollable content */}
      <LegendList
        ref={listRef}
        data={allData ?? []}
        renderItem={({ item, index }) => (
          <RowCard
            row={item as Record<string, unknown>}
            rowNumber={index + 1}
          />
        )}
        keyExtractor={(_, index) => String(index)}
        estimatedItemSize={120}
        recycleItems
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 48
        }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={
          <View className="mb-3">
            <SortControls
              columns={columnNames}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSortColumnChange={handleSortColumnChange}
              onSortOrderToggle={() =>
                setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
              }
            />
            <StatsBar columns={columns} totalRows={totalRows} />
          </View>
        }
      />

      {/* Floating back button */}
      <FloatingBackButton type={type} name={name} />

      {/* Scroll to top pill - animated */}
      <Animated.View
        pointerEvents={showScrollTop ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          left: '50%',
          transform: [
            { translateX: -60 },
            {
              translateY: scrollTopAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            },
            {
              scale: scrollTopAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }
          ],
          opacity: scrollTopAnim,
          bottom: 16
        }}
      >
        <Pressable
          onPress={scrollToTop}
          className="bg-primary flex-row items-center gap-1.5 rounded-full px-4 py-2.5 shadow-lg"
        >
          <Icon name="ArrowUp" size={14} className="text-primary-foreground" />
          <Text className="text-primary-foreground text-xs font-medium">
            Back to top
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  )
}

function FloatingBackButton({
  type,
  name
}: {
  type: 'table' | 'view'
  name: string
}) {
  const colorScheme = useColorScheme()

  return (
    <View className="absolute top-2 left-3 z-10 overflow-hidden rounded-full">
      <BlurView
        intensity={80}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        className="flex-row items-center"
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1 px-2 py-1.5 pr-3"
        >
          <Icon name="ChevronLeft" size={18} className="text-primary" />
          <Icon
            name={type === 'table' ? 'Table' : 'Eye'}
            size={11}
            className="text-primary"
          />
          <Text
            className="text-foreground max-w-[180px] text-xs font-medium"
            numberOfLines={1}
          >
            {name}
          </Text>
        </Pressable>
      </BlurView>
    </View>
  )
}
