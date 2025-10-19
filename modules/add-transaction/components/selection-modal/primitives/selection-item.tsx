import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable, View } from 'react-native'
import type { SelectableRowProps } from '../types'

export function SelectionItem({
  selected,
  disabled,
  onPress,
  leftElement,
  title,
  subtitle,
  rightElement
}: SelectableRowProps) {
  const rowClass = selected
    ? 'border-primary/40 bg-primary/5'
    : disabled
      ? 'border-border bg-transparent opacity-50'
      : 'border-border bg-transparent active:bg-muted'

  const isTextTitle = typeof title === 'string' || typeof title === 'number'
  const isTextLeftElement =
    typeof leftElement === 'string' || typeof leftElement === 'number'
  const isTextRightElement =
    typeof rightElement === 'string' || typeof rightElement === 'number'
  const hasRightElement = rightElement !== undefined && rightElement !== null
  const justifyContentClass = hasRightElement
    ? 'justify-between'
    : 'justify-start'

  return (
    <Pressable
      disabled={disabled}
      className={`my-1 flex-1 rounded-xl border p-4 ${rowClass}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      accessibilityLabel={isTextTitle ? String(title) : undefined}
      accessibilityHint={subtitle}
    >
      <View className={`flex-row items-center ${justifyContentClass}`}>
        <View className="min-w-0 flex-1 flex-row items-center">
          {leftElement ? (
            <View className="mr-3 rounded-lg bg-primary/10 p-2">
              {isTextLeftElement ? (
                <Text className="text-sm font-semibold text-primary">
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
                  className="text-base font-medium text-foreground"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    className="text-sm text-muted-foreground"
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
            <Text className="text-sm text-muted-foreground">
              {rightElement}
            </Text>
          ) : (
            rightElement
          )
        ) : null}
      </View>
    </Pressable>
  )
}
