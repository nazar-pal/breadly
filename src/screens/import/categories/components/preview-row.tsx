import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import React from 'react'
import { View } from 'react-native'
import type { CsvArr } from '../lib/csv-arr-schema'

type PreviewRowProps = {
  row: CsvArr[number]
  parentName?: string
}

export function PreviewRow({ row, parentName }: PreviewRowProps) {
  return (
    <View
      style={{ marginLeft: row.parentId ? 12 : 0 }}
      className={cn(
        row.parentId && 'border-border/60 border-l border-dashed pl-3'
      )}
    >
      <View
        className={cn(
          'relative rounded-md border p-3',
          row.isArchived
            ? 'border-muted-foreground/30 bg-muted/30 opacity-75'
            : 'border-border bg-card'
        )}
      >
        <View
          className={cn(
            'absolute top-2 right-2 z-10 rounded px-1.5 py-0.5',
            row.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
          )}
        >
          <Text
            className={cn(
              'text-[10px] font-medium capitalize',
              row.type === 'income' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {row.type}
          </Text>
        </View>

        <View className="flex-1 gap-1.5 pr-16">
          <View className="flex-row items-center gap-2">
            <Icon name={row.icon} size={16} />
            <Text
              className={cn(
                'font-medium',
                row.isArchived && 'text-muted-foreground line-through'
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {row.name}
            </Text>
          </View>
          <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
            {parentName && (
              <Text className="text-muted-foreground text-xs">
                Parent: {parentName}
              </Text>
            )}
            <Text className="text-muted-foreground text-xs">
              Created: {format(row.createdAt, 'yyyy-MM-dd')}
            </Text>
            {row.archivedAt && (
              <Text className="text-muted-foreground text-xs">
                Archived: {format(row.archivedAt, 'yyyy-MM-dd')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
