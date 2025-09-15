import { Icon } from '@/components/icon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { useQuery } from '@powersync/react-native'
import { useLocalSearchParams } from 'expo-router'
import { AlertCircle, CheckCircle2 } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { z } from 'zod'

const ParamsSchema = z.object({
  slug: z.tuple([
    z.enum(['view', 'table']),
    z.string().min(1, 'Second parameter must be a non-empty string')
  ])
})

export default function CatchAllScreen() {
  if (!__DEV__) return null

  return <CatchAll />
}

function CatchAll() {
  const rawParams = useLocalSearchParams()
  const parseResult = ParamsSchema.safeParse(rawParams)
  const { slug } = parseResult.success
    ? parseResult.data
    : { slug: ['table', 'unknown'] }
  const [type, name] = slug

  const escapeIdent = (value?: string) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`
  const safeIdent = escapeIdent(name)

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  // UI-only holder for select's internal value if needed in the future
  const [page, setPage] = useState(1)
  const pageSize = 20

  const {
    data: columnInfo,
    isLoading: columnsLoading,
    refresh: refreshCols
  } = useQuery(`PRAGMA table_info(${safeIdent})`)
  const columnNames: string[] = (columnInfo ?? []).map((c: any) => c.name)
  const sortOptions: string[] = columnNames

  const orderByClause = sortColumn
    ? `ORDER BY ${escapeIdent(sortColumn)} ${sortOrder.toUpperCase()}`
    : ''

  const {
    data: countRows,
    isLoading: countLoading,
    isFetching: countFetching,
    refresh: refreshCount
  } = useQuery(`SELECT COUNT(*) as count FROM ${safeIdent}`, [], {
    runQueryOnce: false
  })
  const totalRows = countRows?.[0]?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const currentPage = Math.min(page, totalPages)
  const offset = (currentPage - 1) * pageSize

  const {
    data: pageData,
    isLoading,
    isFetching,
    refresh,
    error
  } = useQuery(
    `SELECT * FROM ${safeIdent} ${orderByClause} LIMIT ? OFFSET ?`,
    [pageSize, offset],
    { runQueryOnce: false }
  )

  if (!parseResult.success) {
    return (
      <View className="flex-1 bg-background p-4">
        <Text className="text-base text-red-500">
          Error: {parseResult.error.message || 'Invalid parameters'}
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          Expected format: /db/[view|table]/[name]
        </Text>
      </View>
    )
  }

  const columns = pageData?.[0] ? Object.keys(pageData[0]) : columnNames
  const rowCount = pageData?.length ?? 0

  const isRefreshing = isFetching || countFetching
  const handleRefresh = () => {
    refresh?.()
    refreshCols?.()
    refreshCount?.()
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="px-4 py-3">
      {/* Status and refresh controls */}
      <View className="mb-3 flex-row gap-3">
        <View className="flex-1 pr-2">
          <Text className="text-muted-foreground" numberOfLines={1}>
            Database {type}:
          </Text>
          <Text className="text-foreground">{name}</Text>
        </View>

        <Button
          variant="outline"
          size="sm"
          className="flex-row items-center gap-2"
          onPress={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          {isLoading || isRefreshing ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon name="RefreshCcw" size={14} />
          )}
          <Text>{isRefreshing ? 'Refreshing…' : 'Refresh'}</Text>
        </Button>
      </View>

      {/* Sort controls */}
      <View className="mb-4 flex-row flex-wrap items-center gap-2">
        <Select
          value={(sortColumn as any) ?? ''}
          onValueChange={(v: any) => {
            const next = (v && (v.value ?? v)) as string | undefined
            setSortColumn(next || undefined)
            setPage(1)
          }}
        >
          <SelectTrigger className="min-w-[140px]">
            <SelectValue
              placeholder={sortColumn || 'Select column'}
              className="text-muted-foreground"
            />
          </SelectTrigger>
          <SelectContent>
            <NativeSelectScrollView>
              {sortOptions.map(col => (
                <SelectItem key={col} value={col} label={col} />
              ))}
            </NativeSelectScrollView>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onPress={() => setSortOrder(p => (p === 'asc' ? 'desc' : 'asc'))}
          disabled={!sortColumn}
        >
          <View className="flex-row items-center gap-1">
            {sortOrder === 'asc' ? (
              <Icon name="ArrowDownAZ" size={14} />
            ) : (
              <Icon name="ArrowUpAZ" size={14} />
            )}
            <Text>{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</Text>
          </View>
        </Button>
      </View>

      {/* Error display */}
      {!!error && (
        <Alert icon={AlertCircle} variant="destructive" className="mb-4">
          <AlertTitle>Error loading data</AlertTitle>
          <AlertDescription>
            {error?.message || 'Something went wrong.'}
          </AlertDescription>
          <View className="mt-3 flex-row gap-2 pl-7">
            <Button size="sm" variant="outline" onPress={() => refresh?.()}>
              <Text>Try again</Text>
            </Button>
          </View>
        </Alert>
      )}

      {/* Data display */}
      {(isLoading || columnsLoading || countLoading) && rowCount === 0 ? (
        <View className="items-center py-8">
          <ActivityIndicator size="small" />
          <Text className="mt-2 text-sm text-muted-foreground">Loading…</Text>
        </View>
      ) : (
        <View className={`gap-3 ${isRefreshing ? 'opacity-60' : ''}`}>
          <Text className="text-sm text-muted-foreground">
            Columns ({columns.length}):{' '}
            <Text className="text-foreground" numberOfLines={1}>
              {columns.join(', ') || '—'}
            </Text>
          </Text>
          <Text className="text-sm text-muted-foreground">
            Total rows: {totalRows}
          </Text>
          <View className="h-px bg-border" />
          {/* Cards for rows with improved readability */}
          {totalRows === 0 ? (
            <View className="items-center rounded-md border border-border bg-card p-6">
              <CheckCircle2 size={16} />
              <Text className="mt-2 text-sm text-muted-foreground">
                No rows
              </Text>
            </View>
          ) : (
            (pageData ?? []).map((row, idx) => (
              <View
                key={idx}
                className="rounded-md border border-border bg-card p-3"
              >
                <Text className="mb-2 text-xs text-muted-foreground">
                  #{offset + idx + 1}
                </Text>
                <Text selectable className="text-xs text-foreground">
                  {JSON.stringify(row, null, 2)}
                </Text>
              </View>
            ))
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <View className="mt-2 flex-row items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onPress={() => setPage(p => Math.max(1, p - 1))}
              >
                <Text>Prev</Text>
              </Button>
              <Text className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onPress={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                <Text>Next</Text>
              </Button>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}
