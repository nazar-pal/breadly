import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function AccountHeaderBadge({
  children,
  variant = 'secondary',
  className
}: {
  children: React.ReactNode
  variant?: 'secondary' | 'border'
  className?: string
}) {
  const backgroundClass = variant === 'secondary' ? 'bg-secondary' : 'bg-border'
  return (
    <View
      className={cn('rounded-full px-2 py-0.5', backgroundClass, className)}
    >
      <Text className="text-muted-foreground text-[11px] font-medium">
        {children}
      </Text>
    </View>
  )
}
