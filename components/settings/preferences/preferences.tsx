import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { CurrencyPreference } from './preference-currency'
import { ThemePreferences } from './preference-theme'

export function Preferences() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <CurrencyPreference />
        <ThemePreferences />
      </CardContent>
    </Card>
  )
}
