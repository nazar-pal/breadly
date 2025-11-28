import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { ActivityIndicator, View } from 'react-native'
import type { SortMode, SortOrder } from '../lib/types'

type HeaderControlsProps = {
  sortMode: SortMode
  sortOrder: SortOrder
  isRefreshing: boolean
  onSortModeChange: (mode: SortMode) => void
  onSortOrderToggle: () => void
  onRefresh: () => void
}

export function HeaderControls({
  sortMode,
  sortOrder,
  isRefreshing,
  onSortModeChange,
  onSortOrderToggle,
  onRefresh
}: HeaderControlsProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      {/* Sort controls */}
      <View className="flex-row items-center gap-1">
        <Button
          variant={sortMode === 'default' ? 'default' : 'outline'}
          size="sm"
          className="h-8"
          onPress={() => onSortModeChange('default')}
        >
          <Text>Default</Text>
        </Button>
        <Button
          variant={sortMode === 'rows' ? 'default' : 'outline'}
          size="sm"
          className="h-8"
          onPress={() => onSortModeChange('rows')}
        >
          <Text>By Rows</Text>
        </Button>
        {sortMode === 'rows' && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onPress={onSortOrderToggle}
          >
            <Icon
              name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              size={14}
              className="text-foreground"
            />
          </Button>
        )}
      </View>

      {/* Refresh button */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 flex-row items-center gap-2"
        onPress={onRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <ActivityIndicator size="small" />
        ) : (
          <Icon name="RefreshCw" size={14} className="text-foreground" />
        )}
        <Text>{isRefreshing ? 'Refreshing…' : 'Refresh'}</Text>
      </Button>
    </View>
  )
}
