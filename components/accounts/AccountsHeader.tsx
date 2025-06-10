import React from 'react'
import { Text, View } from 'react-native'

interface AccountsHeaderProps {
  title?: string
}

export default function AccountsHeader({
  title = 'Accounts'
}: AccountsHeaderProps) {
  return (
    <View className="bg-background px-4 py-3">
      <Text className="text-[32px] font-extrabold tracking-tighter text-foreground">
        {title}
      </Text>
    </View>
  )
}
