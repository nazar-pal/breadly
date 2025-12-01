import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { View } from 'react-native'
import type { SortOrder } from '../lib'

type SortControlsProps = {
  columns: string[]
  sortColumn: string | undefined
  sortOrder: SortOrder
  onSortColumnChange: (column: string | undefined) => void
  onSortOrderToggle: () => void
}

export function SortControls({
  columns,
  sortColumn,
  sortOrder,
  onSortColumnChange,
  onSortOrderToggle
}: SortControlsProps) {
  if (columns.length === 0) return null

  return (
    <View className="mb-4 flex-row items-center gap-2">
      <Select
        value={(sortColumn as any) ?? ''}
        onValueChange={(v: any) => {
          const next = (v && (v.value ?? v)) as string | undefined
          onSortColumnChange(next || undefined)
        }}
      >
        <SelectTrigger className="min-w-[140px] flex-1">
          <SelectValue
            placeholder="Sort by column..."
            className="text-muted-foreground"
          />
        </SelectTrigger>
        <SelectContent>
          <NativeSelectScrollView>
            {columns.map(col => (
              <SelectItem key={col} value={col} label={col} />
            ))}
          </NativeSelectScrollView>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        className="h-10"
        onPress={onSortOrderToggle}
        disabled={!sortColumn}
      >
        <Icon
          name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
          size={14}
          className="text-foreground"
        />
      </Button>

      {sortColumn && (
        <Button
          variant="ghost"
          size="sm"
          className="h-10"
          onPress={() => onSortColumnChange(undefined)}
        >
          <Icon name="X" size={14} className="text-muted-foreground" />
        </Button>
      )}
    </View>
  )
}
