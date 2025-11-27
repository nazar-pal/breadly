import { trpcClient } from '@/data/trpc/react'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { InfoCard, LogViewer, TestActions } from './components'
import type { LogEntry, LogLevel } from './lib'

export default function TrpcTestScreen() {
  const insets = useSafeAreaInsets()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addLog = (level: LogLevel, message: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        level,
        message
      }
    ])
  }

  const clearLogs = () => setLogs([])

  const withRunning = async (fn: () => Promise<void>) => {
    setIsRunning(true)
    try {
      await fn()
    } finally {
      setIsRunning(false)
    }
  }

  const runHello = () =>
    withRunning(async () => {
      const started = Date.now()
      addLog('info', 'Testing hello endpoint...')
      try {
        const res = await trpcClient.appTest.hello.query({ text: 'world' })
        addLog('success', `${res.greeting} (${Date.now() - started}ms)`)
      } catch (e) {
        addLog('error', e instanceof Error ? e.message : String(e))
      }
    })

  const runAuth = () =>
    withRunning(async () => {
      const started = Date.now()
      addLog('info', 'Testing auth endpoint...')
      try {
        const res = await trpcClient.appTest.testAuth.query()
        addLog('success', `userId: ${res.userId} (${Date.now() - started}ms)`)
      } catch (e) {
        addLog('error', e instanceof Error ? e.message : String(e))
      }
    })

  return (
    <View
      className="flex-1 bg-background p-4"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <InfoCard />
      <TestActions
        onRunHello={runHello}
        onRunAuth={runAuth}
        isRunning={isRunning}
      />
      <LogViewer logs={logs} onClear={clearLogs} />
    </View>
  )
}
