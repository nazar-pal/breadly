import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

export function ImportInstructionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon name="Info" size={18} className="text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CSV Requirements</DialogTitle>
        </DialogHeader>
        <ImportInstructionsCard />
        <DialogFooter className="p-0">
          <DialogClose className="flex-1">
            <Button variant="ghost" className="w-full ">
              <Text>Got it</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ImportInstructionsCard() {
  return (
    <View className="gap-4 p-5">
      <Section title="Required Columns" items={REQUIRED_COLUMNS} />
      <Section title="Optional Columns" items={OPTIONAL_COLUMNS} />

      <View className="gap-1 rounded-md bg-primary/5 p-3">
        <Text className="text-sm font-semibold text-primary">
          Additional Rules
        </Text>
        {ADDITIONAL_RULES.map((rule, index) => (
          <Text key={index} className="text-sm text-muted-foreground">
            • {rule}
          </Text>
        ))}
      </View>

      <View className="gap-1 rounded-md bg-muted/30 p-3">
        <Text className="text-xs font-semibold text-muted-foreground">
          Note
        </Text>
        <Text className="text-xs text-muted-foreground">{NOTE}</Text>
      </View>
    </View>
  )
}

function Section({
  title,
  items
}: {
  title: string
  items: typeof REQUIRED_COLUMNS
}) {
  return (
    <View className="gap-3">
      <Text className="font-medium text-primary">{title}</Text>
      {items.map(item => (
        <View key={item.label} className="gap-2 rounded-md bg-muted/30 p-3">
          <Text className="font-mono text-xs font-semibold">{item.label}</Text>
          <Text className="text-sm text-muted-foreground">
            {item.description}
          </Text>
        </View>
      ))}
    </View>
  )
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <Text className="font-mono">{children}</Text>
)

const REQUIRED_COLUMNS = [
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
        Creation date as ISO date <Code>YYYY-MM-DD</Code> (date-only; no time).
      </>
    )
  }
]

const OPTIONAL_COLUMNS = [
  {
    label: 'parentId',
    description:
      'CSV id of the parent category. Leave empty for top-level categories. Must reference another row’s id in this file with the same type.'
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
        Lucide icon name (e.g. <Code>BookOpen</Code>, <Code>ShoppingBag</Code>).
        Case is flexible; we normalize common formats. Defaults to{' '}
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
]

const ADDITIONAL_RULES = [
  'There must be no duplicate ids in the file.',
  'If a category is referenced as a parent by another category, it may not have its own parent (single-level hierarchy only).',
  'A category may not reference itself as its parent.',
  'A parent must exist in the same file with the same type; parents can appear before or after their children.',
  <>
    Dates must be valid ISO format <Code>YYYY-MM-DD</Code>. Time values are not
    accepted.
  </>
]

const NOTE =
  'Column order does not matter, but the header names must match exactly: id, parentId, name, type, icon, createdAt, isArchived, archivedAt. Empty cells are treated as missing; values are trimmed before validation. The CSV id and parentId values are not stored in the database — they are used only to build hierarchy during import. New UUIDs are generated for categories in the database.'
