import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { getBaseUrl } from '@/data/trpc/base-url'
import { trpcClient } from '@/data/trpc/react'
import { useEffect, useRef, useState } from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type LogLine = {
  at: number
  level: 'info' | 'error' | 'success'
  message: string
}

function formatMs(ms: number) {
  return `${ms}ms`
}

export default function Test() {
  const [logs, setLogs] = useState<LogLine[]>([])
  const [running, setRunning] = useState(false)

  const add = (level: LogLine['level'], message: string) => {
    setLogs(prev => [...prev, { at: Date.now(), level, message }])
  }

  const clear = () => setLogs([])

  const withRunning = async (fn: () => Promise<void>) => {
    setRunning(true)
    try {
      await fn()
    } finally {
      setRunning(false)
    }
  }

  const execHello = async () => {
    const started = Date.now()
    add('info', 'Hello: start')
    try {
      const res = await trpcClient.appTest.hello.query({ text: 'world' })
      add(
        'success',
        `Hello: ${res.greeting} (${formatMs(Date.now() - started)})`
      )
    } catch (e) {
      add(
        'error',
        `Hello failed: ${e instanceof Error ? e.message : String(e)}`
      )
    }
  }

  const execAuth = async () => {
    const started = Date.now()
    add('info', 'Auth: start')
    try {
      const res = await trpcClient.appTest.testAuth.query()
      add(
        'success',
        `Auth: userId=${res.userId} (${formatMs(Date.now() - started)})`
      )
    } catch (e) {
      add('error', `Auth failed: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const runHello = () => withRunning(execHello)
  const runAuth = () => withRunning(execAuth)

  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true })
  }, [logs])

  return (
    <View
      className="flex-1 p-4"
      style={{
        paddingBottom: insets.bottom + 16
      }}
    >
      <Card className="mb-4 gap-2 p-3">
        <Text className="text-sm">Base URL: {getBaseUrl?.() ?? 'unknown'}</Text>
        <Text className="text-sm">Platform: {Platform.OS}</Text>
      </Card>

      <View className="mb-4 gap-3">
        <Button onPress={runHello} disabled={running}>
          <Text>Run Hello (public)</Text>
        </Button>
        <Button onPress={runAuth} disabled={running}>
          <Text>Run Auth (protected)</Text>
        </Button>
        <Button onPress={clear} variant="outline" disabled={running}>
          <Text>Clear</Text>
        </Button>
      </View>

      <Card className="flex-1 p-3">
        <Text className="mb-2 text-lg font-semibold">Results</Text>
        <ScrollView className="flex-1" ref={scrollRef}>
          {logs.length === 0 ? (
            <Text className="text-gray-500">No output yet</Text>
          ) : (
            logs.map((l, i) => (
              <Text
                key={`${l.at}-${i}`}
                className={
                  l.level === 'error'
                    ? 'mb-1 text-red-600'
                    : l.level === 'success'
                      ? 'mb-1 text-green-600'
                      : 'mb-1 text-gray-800'
                }
              >
                {new Date(l.at).toLocaleTimeString()} — {l.message}
              </Text>
            ))
          )}
        </ScrollView>
      </Card>
    </View>
  )
}
