import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export function LoadingFooter() {
  return (
    <View className="items-center py-4">
      <ActivityIndicator size="small" />
    </View>
  )
}
