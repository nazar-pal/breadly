import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { FileUp, Upload } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

interface ImportEmptyStateProps {
  onPress: () => void
  type: 'transactions' | 'categories'
}

export function EmptyState({ onPress, type }: ImportEmptyStateProps) {
  const isTransactions = type === 'transactions'

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="items-center gap-5">
        <View className="h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <FileUp size={36} className="text-primary" strokeWidth={1.5} />
        </View>

        <View className="items-center gap-1.5">
          <Text className="text-center text-lg font-semibold">
            {isTransactions ? 'Import Transactions' : 'Import Categories'}
          </Text>
          <Text className="max-w-[260px] text-center text-sm text-muted-foreground">
            {isTransactions
              ? 'Add transactions from a CSV file'
              : 'Add categories from a CSV file'}
          </Text>
        </View>

        <Button onPress={onPress} className="mt-1 min-w-[160px]">
          <Upload size={16} className="text-primary-foreground" />
          <Text>Choose File</Text>
        </Button>
      </View>
    </View>
  )
}
