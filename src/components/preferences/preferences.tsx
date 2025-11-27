import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { CurrencyPreference } from './preference-currency'

export function Preferences() {
  return (
    <Card>
      <CardContent className="py-2">
        <CurrencyPreference />
      </CardContent>
    </Card>
  )
}
