import type { IconName } from '@/components/ui/icon-by-name'

export type TransactionType = 'income' | 'expense' | 'transfer'

export interface TypeConfig {
  icon: IconName
  color: string
  bg: string
  gradient: [string, string]
}

export function getTypeConfig(type: TransactionType): TypeConfig {
  switch (type) {
    case 'income':
      return {
        icon: 'TrendingUp',
        color: 'text-income',
        bg: 'bg-income/10',
        gradient: ['#10b9811A', '#10b98133']
      }
    case 'expense':
      return {
        icon: 'TrendingDown',
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        gradient: ['#ef44441A', '#ef444433']
      }
    case 'transfer':
      return {
        icon: 'ArrowLeftRight',
        color: 'text-primary',
        bg: 'bg-primary/10',
        gradient: ['#3b82f61A', '#3b82f633']
      }
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
