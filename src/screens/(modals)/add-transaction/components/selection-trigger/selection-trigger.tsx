import { Icon } from '@/components/ui/icon-by-name'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, View } from 'react-native'
import { useTransactionParamsState } from '../../store'
import type { Direction } from '../../types'
import { getSelectionSlot } from '../../utils/params-derived'
import { SelectionTriggerContent } from './selection-trigger-content'
import { SelectionTriggerLabel } from './selection-trigger-label'

interface Props {
  onPress: () => void
  className?: string
  direction: Direction
}

export function SelectionTrigger({ onPress, className, direction }: Props) {
  const params = useTransactionParamsState()
  const slot = getSelectionSlot(direction, params)

  return (
    <Pressable
      className={cn(
        'flex-1 flex-row items-center justify-between',
        'rounded-xl border px-3.5 py-3',
        'border-input bg-card/90 active:bg-muted/60 dark:bg-card/40 dark:active:bg-card/60 shadow-md shadow-black/10',
        className
      )}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View className="flex-1 flex-row items-center">
        <View className="bg-primary/10 mr-3 rounded-lg p-2">
          <SelectionTriggerContent render="icon" slot={slot} />
        </View>
        <View className="flex-1">
          <SelectionTriggerLabel slot={slot} />
          <SelectionTriggerContent render="name" slot={slot} />
        </View>
      </View>
      <Icon
        name="ChevronDown"
        size={14}
        className="text-muted-foreground ml-1"
      />
    </Pressable>
  )
}
