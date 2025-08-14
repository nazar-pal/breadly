import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Muted } from '@/components/ui/typography'
import { PowerSyncStatusContent } from './power-sync-status-content'

export function PowerSyncStatus() {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Synchronization</CardTitle>
        <Muted>Connection status and last sync</Muted>
      </CardHeader>
      <CardContent className="pt-2">
        <PowerSyncStatusContent />
      </CardContent>
    </Card>
  )
}
