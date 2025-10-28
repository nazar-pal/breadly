import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { CurrencyPreference } from './preference-currency'

export function Preferences() {
  return (
    <Card className="mt-4">
      {/* <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader> */}
      <CardContent>
        <CurrencyPreference />
      </CardContent>
    </Card>
  )
}
