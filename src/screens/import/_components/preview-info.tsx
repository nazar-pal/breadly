import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

type PreviewInfoProps = {
  fileName?: string
  dataCount: number
  fileSizeLabel?: string
  warningsCount: number
  onChangeFile: () => void
  onCancel: () => void
  type: 'transactions' | 'categories'
}
export function PreviewInfo({
  fileName,
  dataCount,
  fileSizeLabel,
  warningsCount,
  onChangeFile,
  onCancel,
  type
}: PreviewInfoProps) {
  const label =
    type === 'transactions'
      ? dataCount === 1
        ? 'transaction'
        : 'transactions'
      : dataCount === 1
        ? 'category'
        : 'categories'

  return (
    <View className="flex-row items-center justify-between px-4 pb-2">
      <View className="flex-1">
        {fileName ? (
          <Text className="text-sm font-medium" numberOfLines={1}>
            {fileName}
          </Text>
        ) : null}
        <View className="flex-row flex-wrap items-center gap-x-2">
          <Text className="text-xs text-muted-foreground">
            {dataCount} {label}
          </Text>
          {fileSizeLabel ? (
            <Text className="text-xs text-muted-foreground">
              • {fileSizeLabel}
            </Text>
          ) : null}
          {warningsCount > 0 ? (
            <Text className="text-xs text-yellow-700">
              • {warningsCount} warnings
            </Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row gap-2">
        <Button
          variant="ghost"
          size="sm"
          onPress={onChangeFile}
          className="h-8 px-2"
        >
          <Text className="text-xs">Change</Text>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onPress={onCancel}
          className="h-8 px-2"
        >
          <Text className="text-xs">Clear</Text>
        </Button>
      </View>
    </View>
  )
}
