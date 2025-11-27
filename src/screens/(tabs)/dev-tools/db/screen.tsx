import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { useQuery } from '@powersync/react-native'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EntityList, HeaderControls, SessionStoreCard } from './components'
import { getTableGroupNumber, type SortMode, type SortOrder } from './lib'

export default function DbScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState('tables')
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [rowCounts, setRowCounts] = useState<Record<string, number>>({})

  // Query for all user tables (exclude internal sqlite_*)
  const {
    data: tables,
    isLoading: tablesLoading,
    isFetching: tablesFetching,
    refresh: refreshTables
  } = useQuery(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  )

  // Query for all views
  const {
    data: views,
    isLoading: viewsLoading,
    isFetching: viewsFetching,
    refresh: refreshViews
  } = useQuery("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name")

  const handleRefresh = () => {
    refreshTables?.()
    refreshViews?.()
  }

  const handleCountUpdate = (name: string, count: number) => {
    setRowCounts(prev =>
      prev[name] === count ? prev : { ...prev, [name]: count }
    )
  }

  const isRefreshing = tablesFetching || viewsFetching
  const isLoading = tablesLoading || viewsLoading

  const tablesList = (tables ?? []) as { name: string }[]
  const viewsList = (views ?? []) as { name: string }[]
  const tablesGroupedCount = tablesList.filter(
    t => getTableGroupNumber(t.name) != null
  ).length

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm text-muted-foreground">
          Loading database schema...
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 20
        }}
      >
        <HeaderControls
          sortMode={sortMode}
          sortOrder={sortOrder}
          isRefreshing={isRefreshing}
          onSortModeChange={setSortMode}
          onSortOrderToggle={() =>
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
          }
          onRefresh={handleRefresh}
        />

        <SessionStoreCard />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-3">
            <TabsTrigger value="tables" className="flex-1">
              <Text>
                Tables ({tablesList.length} · grouped {tablesGroupedCount})
              </Text>
            </TabsTrigger>
            <TabsTrigger value="views" className="flex-1">
              <Text>Views ({viewsList.length})</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <EntityList
              entities={tablesList}
              entityType="table"
              isRefreshing={isRefreshing}
              sortMode={sortMode}
              sortOrder={sortOrder}
              rowCounts={rowCounts}
              onCountUpdate={handleCountUpdate}
            />
          </TabsContent>

          <TabsContent value="views">
            <EntityList
              entities={viewsList}
              entityType="view"
              isRefreshing={isRefreshing}
              sortMode={sortMode}
              sortOrder={sortOrder}
              rowCounts={rowCounts}
              onCountUpdate={handleCountUpdate}
            />
          </TabsContent>
        </Tabs>
      </ScrollView>
    </View>
  )
}
