import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@powersync/react-native'
import { router } from 'expo-router'
import { Activity, RefreshCcw } from 'lucide-react-native'
import { useEffect, useState, type ReactNode } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

export default function DbScreen() {
  if (!__DEV__) return null
  return <DbDev />
}

function DbDev() {
  const [activeTab, setActiveTab] = useState('tables')
  const [listSortMode, setListSortMode] = useState<'default' | 'rows'>(
    'default'
  )
  const [rowsOrder, setRowsOrder] = useState<'asc' | 'desc'>('asc')
  const [rowCounts, setRowCounts] = useState<Record<string, number>>({})
  const handleCountUpdate = (name: string, count: number) => {
    setRowCounts(prev =>
      prev[name] === count ? prev : { ...prev, [name]: count }
    )
  }
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

  const isRefreshing = tablesFetching || viewsFetching

  if (tablesLoading || viewsLoading) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-4 py-6"
      >
        <ActivityIndicator size="small" />
        <Text className="mt-2 text-sm text-muted-foreground">
          Loading tables and views…
        </Text>
      </ScrollView>
    )
  }

  const tablesTotal = (tables ?? []).length
  const tablesGrouped = (tables ?? []).filter(
    (t: any) => getTableGroupNumber(t.name) != null
  ).length

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-4 py-6"
    >
      <View className="mb-4 flex-row items-stretch justify-between">
        {/* Sort controls for tables/views list */}
        <View className="mb-3 flex-row items-center gap-2">
          <Button
            variant={listSortMode === 'default' ? 'default' : 'outline'}
            size="sm"
            onPress={() => setListSortMode('default')}
          >
            <Text>Default</Text>
          </Button>
          <Button
            variant={listSortMode === 'rows' ? 'default' : 'outline'}
            size="sm"
            onPress={() => setListSortMode('rows')}
          >
            <Text>Rows</Text>
          </Button>
          {listSortMode === 'rows' ? (
            <Button
              variant="outline"
              size="sm"
              onPress={() => setRowsOrder(p => (p === 'asc' ? 'desc' : 'asc'))}
            >
              <Text>{rowsOrder === 'asc' ? 'Asc' : 'Desc'}</Text>
            </Button>
          ) : null}
        </View>

        {/* Header with refresh button */}
        <View className="mb-3 flex-row items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-row items-center gap-2"
            onPress={handleRefresh}
            disabled={tablesLoading || viewsLoading || isRefreshing}
          >
            {tablesLoading || viewsLoading || isRefreshing ? (
              <ActivityIndicator size="small" />
            ) : (
              <Icon as={RefreshCcw} size={16} />
            )}
            <Text>{isRefreshing ? 'Refreshing…' : 'Refresh'}</Text>
          </Button>
        </View>
      </View>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="tables" className="flex-1">
            <Text>{`Tables (${tablesTotal} · grouped ${tablesGrouped})`}</Text>
          </TabsTrigger>
          <TabsTrigger value="views" className="flex-1">
            <Text>Views ({(views ?? []).length})</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="mt-4">
          <EntityList
            entities={(tables ?? []) as { name: string }[]}
            entityType="table"
            views={views ?? []}
            isRefreshing={isRefreshing}
            listSortMode={listSortMode}
            rowsOrder={rowsOrder}
            rowCounts={rowCounts}
            onCountUpdate={handleCountUpdate}
          />
        </TabsContent>

        <TabsContent value="views" className="mt-4">
          <EntityList
            entities={(views ?? []) as { name: string }[]}
            entityType="view"
            views={views ?? []}
            isRefreshing={isRefreshing}
            listSortMode={listSortMode}
            rowsOrder={rowsOrder}
            rowCounts={rowCounts}
            onCountUpdate={handleCountUpdate}
          />
        </TabsContent>
      </Tabs>
    </ScrollView>
  )
}

const RowCount = ({
  tableName,
  isRefreshing,
  onUpdate
}: {
  tableName: string
  isRefreshing: boolean
  onUpdate?: (name: string, count: number) => void
}) => {
  const { data: countData } = useQuery(
    `SELECT COUNT(*) as count FROM "${String(tableName).replace(/"/g, '""')}"`,
    [],
    { runQueryOnce: false }
  )

  const count = countData?.[0]?.count ?? 0
  useEffect(() => {
    onUpdate?.(tableName, count)
  }, [tableName, count, onUpdate])

  return (
    <Text
      className={`text-[10px] ${isRefreshing ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}
    >
      {count} {count === 1 ? 'row' : 'rows'}
    </Text>
  )
}

// Custom ordering based on folder convention numbers
const TABLE_SORT_GROUPS: Record<string, string[]> = {
  '1': ['currencies'],
  '2': ['exchange_rates', 'exchangeRates'],
  '3': ['user_preferences'],
  '4': ['categories'],
  '5': ['budgets'],
  '6': ['accounts'],
  '7': ['transactions'],
  '8': ['attachments'],
  '9': ['transaction_attachments', 'transactionAttachments']
}

const normalize = (s: string) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

function getTableGroupNumber(name: string): number | null {
  const normName = normalize(name)
  let matchedGroup: number | null = null
  let longest = -1
  const keys = Object.keys(TABLE_SORT_GROUPS)
  for (const key of keys) {
    const patterns = TABLE_SORT_GROUPS[key]
    for (const p of patterns) {
      const pat = normalize(p)
      if (normName.includes(pat) && pat.length > longest) {
        longest = pat.length
        matchedGroup = Number(key)
      }
    }
  }
  return matchedGroup
}

const ALL_GROUP_PATTERNS: string[] = Object.values(TABLE_SORT_GROUPS).flat()

function escapeRegex(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderHighlightedName(name: string): ReactNode[] {
  const patterns = ALL_GROUP_PATTERNS.slice().sort(
    (a, b) => b.length - a.length
  )
  if (!patterns.length) return [name]
  const regex = new RegExp(patterns.map(escapeRegex).join('|'), 'gi')

  const children: ReactNode[] = []
  let lastIndex = 0
  let keyIndex = 0
  for (const match of name.matchAll(regex)) {
    const start = match.index ?? 0
    const end = start + match[0].length
    if (start > lastIndex) {
      children.push(
        <Text key={`t-${keyIndex++}`}>{name.slice(lastIndex, start)}</Text>
      )
    }
    children.push(
      <Text key={`h-${keyIndex++}`} className="text-primary">
        {name.slice(start, end)}
      </Text>
    )
    lastIndex = end
  }
  if (lastIndex < name.length) {
    children.push(<Text key={`t-${keyIndex++}`}>{name.slice(lastIndex)}</Text>)
  }
  return children
}

const INACTIVE_PREFIX = 'inactive_synced_'

function getInactiveAwareSortKey(name: string) {
  const lower = String(name).toLowerCase()
  const isInactive = lower.startsWith(INACTIVE_PREFIX)
  const base = isInactive ? lower.slice(INACTIVE_PREFIX.length) : lower
  return { base, isInactive, fullLower: lower }
}

function shouldShowTableIndicator(
  tableName: string,
  views: { name: string }[]
) {
  const group = getTableGroupNumber(tableName)
  if (group == null) return false
  const lower = String(tableName).toLowerCase()
  const isLocal = lower.startsWith('ps_data_local__local_')
  if (isLocal) return true
  const patterns =
    TABLE_SORT_GROUPS[String(group)]?.map(p => p.toLowerCase()) ?? []
  const hasInactiveView = views.some(v => {
    const vLower = String(v.name).toLowerCase()
    if (!vLower.startsWith(INACTIVE_PREFIX)) return false
    const after = vLower.slice(INACTIVE_PREFIX.length)
    return patterns.some(p => after.startsWith(p))
  })
  return !hasInactiveView
}

// Generic empty state card
function EmptyStateCard({
  label,
  isRefreshing
}: {
  label: string
  isRefreshing: boolean
}) {
  return (
    <View
      className={`rounded-md border border-border bg-card p-6 ${isRefreshing ? 'opacity-60' : ''}`}
    >
      <Text className="text-center text-sm text-muted-foreground">{label}</Text>
    </View>
  )
}

function createEntityComparator(
  listSortMode: 'default' | 'rows',
  rowsOrder: 'asc' | 'desc',
  rowCounts: Record<string, number>
) {
  return (a: { name: string }, b: { name: string }) => {
    if (listSortMode === 'rows') {
      const ra = rowCounts[a.name] ?? 0
      const rb = rowCounts[b.name] ?? 0
      const cmp = ra - rb
      return rowsOrder === 'asc' ? cmp : -cmp
    }
    const ga = getTableGroupNumber(a.name) ?? 9999
    const gb = getTableGroupNumber(b.name) ?? 9999
    const primary = ga - gb
    if (primary !== 0) return primary
    const ka = getInactiveAwareSortKey(a.name)
    const kb = getInactiveAwareSortKey(b.name)
    const baseCmp = ka.base.localeCompare(kb.base)
    if (baseCmp !== 0) return baseCmp
    if (ka.isInactive !== kb.isInactive) return ka.isInactive ? 1 : -1
    return ka.fullLower.localeCompare(kb.fullLower)
  }
}

function EntityList({
  entities,
  entityType,
  views,
  isRefreshing,
  listSortMode,
  rowsOrder,
  rowCounts,
  onCountUpdate
}: {
  entities: { name: string }[]
  entityType: 'table' | 'view'
  views: { name: string }[]
  isRefreshing: boolean
  listSortMode: 'default' | 'rows'
  rowsOrder: 'asc' | 'desc'
  rowCounts: Record<string, number>
  onCountUpdate: (name: string, count: number) => void
}) {
  if (entities.length === 0) {
    return (
      <EmptyStateCard
        label={entityType === 'table' ? 'No tables found' : 'No views found'}
        isRefreshing={isRefreshing}
      />
    )
  }

  const comparator = createEntityComparator(listSortMode, rowsOrder, rowCounts)

  return (
    <Accordion
      type="multiple"
      className={`rounded-md border border-border ${isRefreshing ? 'opacity-60' : ''}`}
    >
      {entities
        .slice()
        .sort(comparator)
        .map((item: { name: string }) => (
          <EntityItem
            key={item.name}
            item={item}
            entityType={entityType}
            views={views}
            isRefreshing={isRefreshing}
            onCountUpdate={onCountUpdate}
          />
        ))}
    </Accordion>
  )
}

function EntityItem({
  item,
  entityType,
  views,
  isRefreshing,
  onCountUpdate
}: {
  item: { name: string }
  entityType: 'table' | 'view'
  views: { name: string }[]
  isRefreshing: boolean
  onCountUpdate: (name: string, count: number) => void
}) {
  const name = item.name
  const safeIdent = `"${String(name).replace(/"/g, '""')}"`
  const groupNumber = getTableGroupNumber(name)
  const showIndicator =
    entityType === 'table' && shouldShowTableIndicator(name, views)

  const { data: columnsData, isLoading: columnsLoading } = useQuery(
    `PRAGMA table_info(${safeIdent})`
  )

  const columns: { name: string; type?: string; pk?: number }[] =
    columnsData ?? []
  const columnsCount = columns.length
  const textSubtleClass = isRefreshing
    ? 'text-muted-foreground/60'
    : 'text-muted-foreground'
  const textNormalClass = isRefreshing
    ? 'text-muted-foreground'
    : 'text-foreground'

  return (
    <AccordionItem value={name}>
      <View className={entityType === 'table' ? 'relative' : undefined}>
        {showIndicator ? (
          <View className="absolute left-1 top-1">
            <Icon as={Activity} size={12} className="text-primary" />
          </View>
        ) : null}
        <View className="flex-row items-center">
          <Button
            variant="ghost"
            className="flex-1 flex-row items-center justify-start p-2"
            onPress={() =>
              router.push(`/db/${entityType}/${encodeURIComponent(name)}`)
            }
          >
            {groupNumber != null ? (
              <Text className="text-xs text-muted-foreground">{`${groupNumber}.`}</Text>
            ) : null}
            <Text className={`ml-1 text-left text-xs ${textNormalClass}`}>
              {renderHighlightedName(name)}
            </Text>
          </Button>
          <AccordionTrigger className="px-3 py-0">
            <View className="mr-2 items-end">
              <RowCount
                tableName={name}
                isRefreshing={isRefreshing}
                onUpdate={onCountUpdate}
              />
              <Text className={`text-[10px] ${textSubtleClass}`}>
                {columnsCount} {columnsCount === 1 ? 'column' : 'columns'}
              </Text>
            </View>
          </AccordionTrigger>
        </View>
      </View>
      <AccordionContent className="px-3">
        {columnsLoading ? (
          <Text className={`text-sm ${textSubtleClass}`}>Loading columns…</Text>
        ) : columnsCount === 0 ? (
          <Text className={`text-sm ${textSubtleClass}`}>
            No columns found.
          </Text>
        ) : (
          <View className="gap-1">
            {columns.map((col: any) => (
              <Text key={col.name} className={`text-sm ${textNormalClass}`}>
                • {col.name}
                {col.type ? (
                  <Text className={`${textSubtleClass}`}>: {col.type}</Text>
                ) : null}
                {col.pk ? (
                  <Text className={`${textSubtleClass}`}> (PK)</Text>
                ) : null}
              </Text>
            ))}
          </View>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
