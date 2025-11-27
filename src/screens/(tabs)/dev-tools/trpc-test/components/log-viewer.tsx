import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useEffect, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import type { LogEntry } from '../lib'

type LogViewerProps = {
  logs: LogEntry[]
  onClear: () => void
}

export function LogViewer({ logs, onClear }: LogViewerProps) {
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true })
  }, [logs])

  const isEmpty = logs.length === 0

  return (
    <Card className="flex-1">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Results</CardTitle>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2"
            onPress={onClear}
          >
            <Icon name="Trash2" size={12} className="text-muted-foreground" />
            <Text className="text-xs text-muted-foreground">Clear</Text>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {isEmpty ? (
            <View className="items-center py-8">
              <Icon
                name="Terminal"
                size={24}
                className="mb-2 text-muted-foreground"
              />
              <Text className="text-sm text-muted-foreground">
                No output yet
              </Text>
            </View>
          ) : (
            <View className="gap-1">
              {logs.map(log => (
                <LogLine key={log.id} log={log} />
              ))}
            </View>
          )}
        </ScrollView>
      </CardContent>
    </Card>
  )
}

function LogLine({ log }: { log: LogEntry }) {
  const time = new Date(log.timestamp).toLocaleTimeString()

  const levelStyles = {
    info: 'text-muted-foreground',
    error: 'text-destructive',
    success: 'text-green-600'
  }

  return (
    <View className="flex-row gap-2">
      <Text className="font-mono text-xs text-muted-foreground">{time}</Text>
      <Text className={`flex-1 text-xs ${levelStyles[log.level]}`}>
        {log.message}
      </Text>
    </View>
  )
}
