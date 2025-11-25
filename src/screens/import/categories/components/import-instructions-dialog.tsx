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
      label: 'id',
      description:
        'Unique row identifier used only for building parent-child relationships during import. Must be unique across the file.'
    },
    {
      label: 'name',
      description:
        'Category display name (min 3 characters). Uniqueness is enforced per user+parent in the app.'
    },
    {
      label: 'createdAt',
      description: (
        <>
          Creation date as ISO date <Code>YYYY-MM-DD</Code> (date-only; no
          time).
        </>
      )
    }
  ],
  optionalColumns: [
    {
      label: 'parentId',
      description:
        "CSV id of the parent category. Leave empty for top-level categories. Must reference another row's id in this file with the same type."
    },
    {
      label: 'type',
      description: (
        <>
          <Code>expense</Code> or <Code>income</Code>. Defaults to{' '}
          <Code>expense</Code> when omitted.
        </>
      )
    },
    {
      label: 'icon',
      description: (
        <>
          Lucide icon name (e.g. <Code>BookOpen</Code>, <Code>ShoppingBag</Code>
          ). Case is flexible; we normalize common formats. Defaults to{' '}
          <Code>Circle</Code> when omitted or blank. Use a valid Lucide icon.
        </>
      )
    },
    {
      label: 'isArchived',
      description: (
        <>
          <Code>true</Code> or <Code>false</Code> (lowercase, case-sensitive).
          Defaults to <Code>false</Code>.
        </>
      )
    },
    {
      label: 'archivedAt',
      description: (
        <>
          Archive date as ISO <Code>YYYY-MM-DD</Code>. Required when{' '}
          <Code>isArchived = true</Code>.
        </>
      )
    }
  ],
  additionalRules: [
    'There must be no duplicate ids in the file.',
    'If a category is referenced as a parent by another category, it may not have its own parent (single-level hierarchy only).',
    'A category may not reference itself as its parent.',
    'A parent must exist in the same file with the same type; parents can appear before or after their children.',
    <>
      Dates must be valid ISO format <Code>YYYY-MM-DD</Code>. Time values are
      not accepted.
    </>
  ],
  note: 'Column order does not matter, but the header names must match exactly: id, parentId, name, type, icon, createdAt, isArchived, archivedAt. Empty cells are treated as missing; values are trimmed before validation. The CSV id and parentId values are not stored in the database — they are used only to build hierarchy during import. New UUIDs are generated for categories in the database.'
}
