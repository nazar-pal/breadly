import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable } from 'react-native'

interface Props extends React.ComponentProps<typeof Pressable> {
  className?: string
}

export function AddAccountButton({ className, ...rest }: Props) {
  return (
    <Pressable
      className={cn(
        'mt-4 min-h-16 flex-row items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-3',
        className
      )}
      {...rest}
    >
      <Icon name="Plus" size={16} className="text-primary" />
      <Text className="text-sm font-semibold">Add Account</Text>
    </Pressable>
  )
}
