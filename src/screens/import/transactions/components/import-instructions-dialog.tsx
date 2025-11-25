import React from 'react'
import {
  ImportInstructionsDialog as BaseDialog,
  Code,
  ImportInstructionsConfig
} from '../../_components'

export function ImportInstructionsDialog() {
  return <BaseDialog config={CONFIG} />
}

const CONFIG: ImportInstructionsConfig = {
  requiredColumns: [
    {
      label: 'date',
      description: (
        <>
          Transaction date as ISO date <Code>YYYY-MM-DD</Code> (date-only; no
          time). Cannot be in the future.
        </>
      )
    },
    {
      label: 'amount',
      description:
        'Transaction amount. Must be a positive number (automatically rounded to 2 decimal places).'
    },
    {
      label: 'type',
      description: (
        <>
          <Code>expense</Code> or <Code>income</Code>. Case-insensitive. Must
          match the category type.
        </>
      )
    },
    {
      label: 'currency',
      description: (
        <>
          Currency code (e.g., <Code>USD</Code>, <Code>EUR</Code>,{' '}
          <Code>GBP</Code>). Case-insensitive.
        </>
      )
    },
    {
      label: 'category',
      description: (
        <>
          Category name (required). Use <Code>=&gt;</Code> for subcategories:{' '}
          <Code>Parent =&gt; Child</Code>. Category must already exist in your
          account.
        </>
      )
    }
  ],
  note: 'Column headers must match exactly: date, amount, type, currency, category. Categories must exist before import (they will not be created automatically). For archived categories, transaction dates must be on or before the archive date.'
}
