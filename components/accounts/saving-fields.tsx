import React from 'react'
import { Control } from 'react-hook-form'
import { CurrencyField, DateField } from './form-fields'

interface SavingFieldsProps {
  control: Control<any>
}

export function SavingFields({ control }: SavingFieldsProps) {
  return (
    <>
      <CurrencyField
        control={control}
        name="savingsTargetAmount"
        label="Savings Goal (Optional)"
      />

      <DateField
        control={control}
        name="savingsTargetDate"
        label="Target Date (Optional)"
      />
    </>
  )
}
