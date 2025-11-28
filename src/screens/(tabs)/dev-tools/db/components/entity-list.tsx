import { Accordion } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import {
  createEntityComparator,
  type EntityType,
  type SortMode,
  type SortOrder
} from '../lib'
import { EntityItem } from './entity-item'

type EntityListProps = {
  entities: { name: string }[]
  entityType: EntityType
  isRefreshing: boolean
  sortMode: SortMode
  sortOrder: SortOrder
  rowCounts: Record<string, number>
  onCountUpdate: (name: string, count: number) => void
}

export function EntityList({
  entities,
  entityType,
  isRefreshing,
  sortMode,
  sortOrder,
  rowCounts,
  onCountUpdate
}: EntityListProps) {
  if (entities.length === 0) {
    return (
      <Card className={isRefreshing ? 'opacity-60' : ''}>
        <CardContent className="items-center py-8">
          <Icon
            name={entityType === 'table' ? 'Table' : 'Eye'}
            size={24}
            className="text-muted-foreground mb-2"
          />
          <Text className="text-muted-foreground text-sm">
            No {entityType}s found
          </Text>
        </CardContent>
      </Card>
    )
  }

  const comparator = createEntityComparator(sortMode, sortOrder, rowCounts)
  const sortedEntities = entities.slice().sort(comparator)

  return (
    <View className={isRefreshing ? 'opacity-60' : ''}>
      <Accordion
        type="multiple"
        className="border-border bg-card rounded-lg border"
      >
        {sortedEntities.map(item => (
          <EntityItem
            key={item.name}
            name={item.name}
            entityType={entityType}
            isRefreshing={isRefreshing}
            onCountUpdate={onCountUpdate}
          />
        ))}
      </Accordion>
    </View>
  )
}
