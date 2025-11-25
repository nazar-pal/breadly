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
import React, { useState } from 'react'
import { View } from 'react-native'
import Animated, { type CSSAnimationKeyframes } from 'react-native-reanimated'

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

// CSS-like keyframe animations
const pulseKeyframes: CSSAnimationKeyframes = {
  '0%': { transform: [{ scale: 1 }] },
  '50%': { transform: [{ scale: 1.15 }] },
  '100%': { transform: [{ scale: 1 }] }
}

const pingKeyframes: CSSAnimationKeyframes = {
  '0%': { opacity: 0.5, transform: [{ scale: 1 }] },
  '100%': { opacity: 0, transform: [{ scale: 1.5 }] }
}

export function ImportInstructionsDialog({
  config
}: {
  config: ImportInstructionsConfig
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setHasInteracted(true)
    }
  }

  const shouldAnimate = !hasInteracted

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="relative">
        {shouldAnimate && (
          <Animated.View
            className="absolute inset-0 rounded-full bg-primary"
            style={{
              opacity: 0,
              animationName: pingKeyframes,
              animationDuration: '1s',
              animationDelay: '0.8s',
              animationIterationCount: 3,
              animationFillMode: 'forwards'
            }}
            pointerEvents="none"
          />
        )}
        <Animated.View
          style={
            shouldAnimate
              ? {
                  animationName: pulseKeyframes,
                  animationDuration: '0.8s',
                  animationDelay: '0.8s',
                  animationIterationCount: 3
                }
              : undefined
          }
          pointerEvents="none"
        >
          <Button variant="ghost" size="icon" pointerEvents="none">
            <Icon name="Info" size={18} className="text-foreground" />
          </Button>
        </Animated.View>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CSV Requirements</DialogTitle>
        </DialogHeader>
        <ImportInstructionsCard config={config} />
        <DialogFooter className="p-0">
          <DialogClose className="flex-1">
            <Button variant="ghost" className="w-full">
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
