import { cn } from '@/lib/utils'
import React from 'react'
import { Text, View, useColorScheme } from 'react-native'

interface SectionHeaderProps {
  title: string
  isFirst?: boolean
  count?: number
}

export function SectionHeader({ title, isFirst, count }: SectionHeaderProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View
      className={cn(
        'flex-row items-center justify-between',
        'mb-2 px-0.5',
        isFirst ? 'mt-0' : 'mt-4'
      )}
    >
      <View className="flex-row items-center gap-1.5">
        <View
          className={cn(
            'h-1 w-1 rounded-full',
            title === 'Today'
              ? 'bg-primary'
              : isDark
                ? 'bg-white/30'
                : 'bg-muted-foreground/40'
          )}
        />
        <Text
          className={cn(
            'text-xs font-semibold tracking-wider uppercase',
            isDark ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {title}
        </Text>
      </View>

      {count !== undefined && count > 0 && (
        <Text
          className={cn(
            'text-[10px]',
            isDark ? 'text-white/40' : 'text-muted-foreground/70'
          )}
        >
          {count}
        </Text>
      )}
    </View>
  )
}
