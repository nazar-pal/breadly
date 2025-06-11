import React from 'react'
import { Control } from 'react-hook-form'
import { CurrencyField, TextField } from './FormFields'

interface CommonAccountFieldsProps<T extends Record<string, any>> {
  control: Control<T>
  isEditing: boolean
}

export default function CommonAccountFields<T extends Record<string, any>>({
  control,
  isEditing
}: CommonAccountFieldsProps<T>) {
  return (
    <>
      <TextField
        control={control}
        name={'name' as any}
        label="Account Name"
        placeholder="Enter account name"
        required
        autoFocus
      />

      <TextField
        control={control}
        name={'description' as any}
        label="Description (Optional)"
        placeholder="Add a description for this account"
        multiline
      />

      <CurrencyField
        control={control}
        name={'balance' as any}
        label={isEditing ? 'Current Balance' : 'Initial Balance'}
        required
      />
    </>
  )
}
