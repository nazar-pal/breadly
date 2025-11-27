import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

type HeaderCardProps = {
  totalItems: number
  jsonCount: number
  onRefresh: () => void
  onClearAll: () => void
  onAddNew: () => void
}

export function HeaderCard({
  totalItems,
  jsonCount,
  onRefresh,
  onClearAll,
  onAddNew
}: HeaderCardProps) {
  const isEmpty = totalItems === 0

  return (
    <Card className="mb-4">
      <CardContent className="flex-row items-center justify-between py-3">
        {/* Stats on the left */}
        <View className="flex-row items-center gap-4">
          <Stat value={totalItems} label="items" />
          <View className="h-4 w-px bg-border" />
          <Stat value={jsonCount} label="JSON" />
        </View>

        {/* Actions on the right */}
        <View className="flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onPress={onAddNew}
          >
            <Icon name="Plus" size={16} className="text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onPress={onRefresh}
          >
            <Icon name="RefreshCw" size={16} className="text-foreground" />
          </Button>
          {!isEmpty && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name="Trash2" size={16} className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {totalItems} items from
                    local storage. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={onClearAll}>
                    <Text>Delete All</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </View>
      </CardContent>
    </Card>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-row items-baseline gap-1">
      <Text className="text-lg font-semibold text-foreground">{value}</Text>
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  )
}
