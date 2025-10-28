import { cn } from '@/lib/utils'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

type StatusColor = 'red' | 'blue' | 'green' | 'yellow' | 'gray'

interface Props {
  color: StatusColor
  iconType?: 'dot' | 'spinner'
  iconColor?: string
  title: string
  titleColor: string
  message?: string
  messageColor?: string
  className?: string
  children?: React.ReactNode
}

export function PowerSyncStatusCard({
  color,
  iconType = 'dot',
  iconColor,
  title,
  titleColor,
  message,
  messageColor,
  className,
  children
}: Props) {
  const bgColor = {
    red: 'bg-red-500/10',
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    yellow: 'bg-yellow-500/10',
    gray: 'bg-muted'
  }[color]

  return (
    <View
      className={cn(
        'my-2 rounded-xl border border-border/10 px-3 py-2',
        bgColor,
        className
      )}
    >
      <View className="flex-row items-center">
        {iconType === 'dot' ? (
          <View
            className={cn(
              'h-2 w-2 rounded-full',
              {
                red: 'bg-red-500',
                blue: 'bg-blue-500',
                green: 'bg-green-500',
                yellow: 'bg-yellow-500',
                gray: 'bg-gray-400'
              }[color]
            )}
          />
        ) : (
          <ActivityIndicator size="small" color={iconColor} />
        )}
        <Text className={cn('ml-2 text-sm font-medium', titleColor)}>
          {title}
        </Text>
      </View>
      {message && (
        <Text className={cn('mt-1 text-xs', messageColor)}>{message}</Text>
      )}
      {children}
    </View>
  )
}
