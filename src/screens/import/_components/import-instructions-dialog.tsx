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

export type ColumnItem = {
  label: string
  description: React.ReactNode
}

export type ImportInstructionsConfig = {
  requiredColumns: ColumnItem[]
  optionalColumns?: ColumnItem[]
  additionalRules?: React.ReactNode[]
  note: string
}

export function ImportInstructionsDialog({
  config
}: {
  config: ImportInstructionsConfig
}) {
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
        <ImportInstructionsCard config={config} />
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

function ImportInstructionsCard({
  config
}: {
  config: ImportInstructionsConfig
}) {
  const { requiredColumns, optionalColumns, additionalRules, note } = config

  return (
    <View className="gap-4 p-5">
      <ColumnsSection title="Required Columns" items={requiredColumns} />

      {optionalColumns && optionalColumns.length > 0 && (
        <ColumnsSection title="Optional Columns" items={optionalColumns} />
      )}

      {additionalRules && additionalRules.length > 0 && (
        <View className="gap-1 rounded-md bg-primary/5 p-3">
          <Text className="text-sm font-semibold text-primary">
            Additional Rules
          </Text>
          {additionalRules.map((rule, index) => (
            <Text key={index} className="text-sm text-muted-foreground">
              • {rule}
            </Text>
          ))}
        </View>
      )}

      <View className="gap-1 rounded-md bg-muted/30 p-3">
        <Text className="text-xs font-semibold text-muted-foreground">
          Note
        </Text>
        <Text className="text-xs text-muted-foreground">{note}</Text>
      </View>
    </View>
  )
}

function ColumnsSection({
  title,
  items
}: {
  title: string
  items: ColumnItem[]
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

export const Code = ({ children }: { children: React.ReactNode }) => (
  <Text className="font-mono">{children}</Text>
)
