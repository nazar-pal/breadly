import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useQuery } from '@powersync/react-native'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import {
  getTableGroupNumber,
  renderHighlightedName,
  type ColumnInfo,
  type EntityType
} from '../lib'

type EntityItemProps = {
  name: string
  entityType: EntityType
  isRefreshing: boolean
  onCountUpdate: (name: string, count: number) => void
}

export function EntityItem({
  name,
  entityType,
  isRefreshing,
  onCountUpdate
}: EntityItemProps) {
  const safeIdent = `"${String(name).replace(/"/g, '""')}"`
  const groupNumber = getTableGroupNumber(name)

  const { data: columnsData, isLoading: columnsLoading } = useQuery(
    `PRAGMA table_info(${safeIdent})`
  )

  const columns: ColumnInfo[] = columnsData ?? []
  const columnsCount = columns.length

  const textMuted = isRefreshing
    ? 'text-muted-foreground/60'
    : 'text-muted-foreground'
  const textNormal = isRefreshing ? 'text-muted-foreground' : 'text-foreground'

  return (
    <AccordionItem value={name} className="border-b border-border last:border-0">
      <View className="flex-row items-center">
        <Button
          variant="ghost"
          className="min-w-0 flex-1 flex-row items-center justify-start px-3 py-2"
          onPress={() =>
            router.push(
              `/dev-tools/db/${entityType}/${encodeURIComponent(name)}`
            )
          }
        >
          {groupNumber != null && (
            <Text className="mr-1 text-xs text-muted-foreground">
              {groupNumber}.
            </Text>
          )}
          <Text className={`text-left text-xs ${textNormal}`} numberOfLines={1}>
            {renderHighlightedName(name)}
          </Text>
        </Button>

        <AccordionTrigger className="items-center px-3 py-2">
          <View className="mr-2 items-end">
            <RowCount
              tableName={name}
              isRefreshing={isRefreshing}
              onUpdate={onCountUpdate}
            />
            <Text className={`text-[10px] ${textMuted}`}>
              {columnsCount} {columnsCount === 1 ? 'col' : 'cols'}
            </Text>
          </View>
        </AccordionTrigger>
      </View>

      <AccordionContent className="px-3 pb-3">
        {columnsLoading ? (
          <Text className={`text-xs ${textMuted}`}>Loading...</Text>
        ) : columnsCount === 0 ? (
          <Text className={`text-xs ${textMuted}`}>No columns</Text>
        ) : (
          <View className="rounded-md bg-muted/30 p-2">
            {columns.map((col, idx) => (
              <View
                key={col.name}
                className={`flex-row items-center justify-between py-1 ${
                  idx < columns.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <Text className={`text-xs ${textNormal}`}>{col.name}</Text>
                <View className="flex-row items-center gap-2">
                  {col.type && (
                    <Text className={`font-mono text-[10px] ${textMuted}`}>
                      {col.type}
                    </Text>
                  )}
                  {col.pk === 1 && (
                    <Text className="text-[10px] font-medium text-primary">
                      PK
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

function RowCount({
  tableName,
  isRefreshing,
  onUpdate
}: {
  tableName: string
  isRefreshing: boolean
  onUpdate: (name: string, count: number) => void
}) {
  const { data: countData } = useQuery(
    `SELECT COUNT(*) as count FROM "${String(tableName).replace(/"/g, '""')}"`,
    [],
    { runQueryOnce: false }
  )

  const count = countData?.[0]?.count ?? 0

  useEffect(() => {
    onUpdate(tableName, count)
  }, [tableName, count, onUpdate])

  const textClass = isRefreshing
    ? 'text-muted-foreground/60'
    : 'text-muted-foreground'

  return (
    <Text className={`text-[10px] ${textClass}`}>
      {count} {count === 1 ? 'row' : 'rows'}
    </Text>
  )
}

