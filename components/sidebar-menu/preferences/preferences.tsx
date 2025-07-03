import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import { CurrencyPreference } from './preference-currency'
import { ThemePreferences } from './preference-theme'

export function Preferences() {
  return (
    <View className="mt-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Preferences
      </Text>

      <Card>
        <CardContent className="px-4 py-2">
          <CurrencyPreference />
          <ThemePreferences />
        </CardContent>
      </Card>
    </View>
  )
}
