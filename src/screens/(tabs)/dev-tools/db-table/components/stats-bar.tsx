import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

type StatsBarProps = {
  columns: string[]
  totalRows: number
}

export function StatsBar({ columns, totalRows }: StatsBarProps) {
  return (
    <View className="mb-3 flex-row items-center gap-4 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
      <StatItem icon="Rows3" value={totalRows} label="rows" />
      <View className="h-5 w-px bg-border" />
      <StatItem icon="Columns3" value={columns.length} label="columns" />
    </View>
  )
}

function StatItem({
  icon,
  value,
  label
}: {
  icon: string
  value: number
  label: string
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Icon name={icon} size={14} className="text-muted-foreground" />
      <View className="flex-row items-baseline gap-1">
        <Text className="text-base font-semibold text-foreground">{value}</Text>
        <Text className="text-xs text-muted-foreground">{label}</Text>
      </View>
    </View>
  )
}
