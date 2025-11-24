import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { FileUp } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

interface ImportEmptyStateProps {
  onPress: () => void
  type: 'transactions' | 'categories'
}

export function EmptyState({ onPress, type }: ImportEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-6 px-8">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-muted/30">
        <FileUp size={40} className="text-foreground/80" />
      </View>
      <View className="items-center gap-2">
        <Text className="text-center text-xl font-bold">
          {type === 'transactions'
            ? 'Import Transactions'
            : 'Import Categories'}
        </Text>
        <Text className="text-center text-base text-muted-foreground">
          Select a CSV file to import your transactions.
        </Text>
      </View>
      <Button onPress={onPress} size="lg" className="w-full max-w-[200px]">
        <Text>Select File</Text>
      </Button>
    </View>
  )
}
