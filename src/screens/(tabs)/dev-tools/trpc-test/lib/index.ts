export type LogLevel = 'info' | 'error' | 'success'

export type LogEntry = {
  id: string
  timestamp: number
  level: LogLevel
  message: string
}
