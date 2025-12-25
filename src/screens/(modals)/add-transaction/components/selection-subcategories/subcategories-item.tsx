import { Badge } from '@/components/ui/badge'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable } from 'react-native'

type Props = {
  label: string
  isSelected?: boolean
  onPress?: () => void
  variant?: 'default' | 'muted-dashed'
}

export function SubcategoriesItem({
  label,
  isSelected = false,
  onPress,
  variant = 'default'
}: Props) {
  return (
    <Badge
      asChild
      className={cn(
        'px-2.5 py-1',
        isSelected ? 'bg-primary' : 'border-foreground/15 bg-background/70',
        variant === 'muted-dashed' && 'border-muted-foreground/50 border-dashed'
      )}
    >
      <Pressable onPress={onPress}>
        <Text
          className={cn(
            'text-sm',
            isSelected ? 'text-primary-foreground' : 'text-foreground',
            variant === 'muted-dashed' && 'text-muted-foreground'
          )}
        >
          {label}
        </Text>
      </Pressable>
    </Badge>
  )
}
