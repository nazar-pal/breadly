import React from 'react'
import { Control } from 'react-hook-form'
import { CurrencyField, DateField, ToggleField } from '../shared/FormFields'

interface DebtFieldsProps {
  control: Control<any>
}

export default function DebtFields({ control }: DebtFieldsProps) {
  return (
    <>
      <CurrencyField
        control={control}
        name="debtInitialAmount"
        label="Original Debt Amount"
        description="How much was originally borrowed or owed?"
      />

      <ToggleField
        control={control}
        name="debtIsOwedToMe"
        label="Debt Direction"
        description="Is this money someone owes you, or money you owe?"
        options={[
          { value: false, label: 'I Owe Money' },
          { value: true, label: 'Owed To Me' }
        ]}
      />

      <DateField
        control={control}
        name="debtDueDate"
        label="Due Date (Optional)"
      />
    </>
  )
}
