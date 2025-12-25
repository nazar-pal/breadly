import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

interface Props {
  status: 'reading' | 'parsing' | 'validating' | 'post-validating'
  progress: number | null
  fileName?: string
  onCancel: () => void
}

export function BusyIndicator({ status, progress, fileName, onCancel }: Props) {
  const statusLabel =
    status === 'reading'
      ? 'Reading file…'
      : status === 'parsing'
        ? 'Parsing file…'
        : status === 'post-validating'
          ? 'Checking categories…'
          : 'Validating data…'

  return (
    <View className="flex-1 items-center justify-center gap-4 px-4">
      <ActivityIndicator />
      <View className="items-center gap-1">
        <Text className="text-sm font-medium">{statusLabel}</Text>
        {status === 'parsing' && progress !== null ? (
          <Text className="text-muted-foreground text-xs">
            {Math.round(progress * 100)}%
          </Text>
        ) : null}
      </View>
      {fileName ? (
        <Text className="text-muted-foreground text-xs" numberOfLines={1}>
          {fileName}
        </Text>
      ) : null}
      {status === 'reading' || status === 'parsing' ? (
        <Button variant="ghost" size="sm" onPress={onCancel}>
          <Text className="text-xs">Cancel</Text>
        </Button>
      ) : null}
    </View>
  )
}
