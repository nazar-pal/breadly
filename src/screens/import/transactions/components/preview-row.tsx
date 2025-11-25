import { Text } from '@/components/ui/text'
import type { RowValidationError } from '@/lib/hooks/use-csv-import'
import { cn, formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { AlertTriangle } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import type { CsvArr } from '../lib/csv-arr-schema'

type PreviewRowProps = {
  row: CsvArr[number]
  error?: RowValidationError
}

export function PreviewRow({ row, error }: PreviewRowProps) {
  const isExpense = row.type === 'expense'
  const hasError = !!error

  return (
    <View
      className={cn(
        'rounded-md border bg-card p-3',
        hasError ? 'border-destructive bg-destructive/5' : 'border-border'
      )}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-1.5">
            {row.parentCategoryName && (
              <>
                <Text className={cn('text-sm', hasError && 'text-destructive')}>
                  {row.parentCategoryName}
                </Text>
                <Text className="text-xs text-muted-foreground">→</Text>
              </>
            )}
            <Text
              className={cn(
                'text-sm font-medium',
                hasError && 'text-destructive'
              )}
            >
              {row.categoryName}
            </Text>
          </View>

          <Text className="text-xs text-muted-foreground">
            {format(row.createdAt, 'PP')}
          </Text>
        </View>

        <Text
          className={cn(
            'text-base font-semibold',
            isExpense ? 'text-red-600' : 'text-green-600'
          )}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(row.amount, row.currency)}
        </Text>
      </View>

      {hasError && (
        <View className="mt-2 flex-row items-start gap-2 rounded-md bg-destructive/10 p-2">
          <AlertTriangle size={14} className="mt-0.5 text-destructive" />
          <Text className="flex-1 text-xs text-destructive">
            {error.message}
          </Text>
        </View>
      )}
    </View>
  )
}
