import React from 'react'
import { Text, View } from 'react-native'

interface SectionHeaderProps {
  title: string
  isFirst?: boolean
}

export function SectionHeader({ title, isFirst }: SectionHeaderProps) {
  return (
    <View className={`mb-2 ${isFirst ? 'mt-0' : 'mt-4'}`}>
      <Text className="text-base font-semibold text-foreground">{title}</Text>
    </View>
  )
}

