import { Icon, type IconName } from '@/components/ui/lucide-icon-by-name'
import { TransactionType } from '@/data/client/db-schema'
import { cn } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

interface OperationConfig {
  icon: IconName
  colorClass: string
  bgColorClass: string
}

const OPERATION_CONFIGS: Record<TransactionType, OperationConfig> = {
  income: {
    icon: 'TrendingUp',
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10'
  },
  expense: {
    icon: 'TrendingDown',
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/10'
  },
  transfer: {
    icon: 'RefreshCw',
    colorClass: 'text-info',
    bgColorClass: 'bg-info/10'
  }
}

export function TransactionIconBadge({ txType }: { txType: TransactionType }) {
  const { icon, colorClass, bgColorClass } = OPERATION_CONFIGS[txType]

  return (
    <View
      className={cn(
        'h-9 w-9 items-center justify-center rounded-xl',
        bgColorClass
      )}
    >
      <Icon name={icon} size={16} className={colorClass} />
    </View>
  )
}
