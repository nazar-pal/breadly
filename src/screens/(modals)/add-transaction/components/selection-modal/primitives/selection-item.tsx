import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, View } from 'react-native'
import type { SelectableRowProps } from '../types'

interface Props extends SelectableRowProps {
  className?: string
}

function isPrimitive(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number'
}

export function SelectionItem({
  selected,
  disabled,
  onPress,
  leftElement,
  title,
  subtitle,
  rightElement,
  className
}: Props) {
  const isTextTitle = isPrimitive(title)
  const isTextLeftElement = isPrimitive(leftElement)
  const isTextRightElement = isPrimitive(rightElement)
  const hasRightElement = rightElement !== undefined && rightElement !== null

  return (
    <Pressable
      disabled={disabled}
      className={cn(
        'flex-row items-center rounded-xl border p-4',
        disabled ? 'opacity-50' : 'active:bg-muted',
        selected
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-transparent',
        hasRightElement ? 'justify-between' : 'justify-start',
        className
      )}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      accessibilityLabel={isTextTitle ? String(title) : undefined}
      accessibilityHint={subtitle}
    >
      <View className="min-w-0 flex-1 flex-row items-center">
        {leftElement ? (
          <View className="bg-primary/10 mr-3 rounded-lg p-2">
            {isTextLeftElement ? (
              <Text className="text-primary text-sm font-semibold">
                {leftElement}
              </Text>
            ) : (
              leftElement
            )}
          </View>
        ) : null}
        <View className="min-w-0 flex-1">
          {isTextTitle ? (
            <>
              <Text
                className="text-foreground text-base font-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  className="text-muted-foreground text-sm"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {subtitle}
                </Text>
              )}
            </>
          ) : (
            title
          )}
        </View>
      </View>
      {rightElement ? (
        isTextRightElement ? (
          <Text className="text-muted-foreground text-sm">{rightElement}</Text>
        ) : (
          rightElement
        )
      ) : null}
    </Pressable>
  )
}
