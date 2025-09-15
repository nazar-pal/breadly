import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '../ui/text'
import { PowerSyncStatusContent } from './power-sync-status-content'

export function PowerSyncStatus() {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Synchronization</CardTitle>
        <Text variant="muted">Connection status and last sync</Text>
      </CardHeader>
      <CardContent className="pt-2">
        <PowerSyncStatusContent />
      </CardContent>
    </Card>
  )
}
