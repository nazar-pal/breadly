import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, View } from 'react-native'

interface PreferenceItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  rightElement?: React.ReactNode
  onPress?: () => void
  showBorder?: boolean
  className?: string
}

// Extracted and improved PreferenceItem component
export function PreferenceItem({
  icon,
  title,
  subtitle,
  rightElement,
  className,
  onPress,
  showBorder = true
}: PreferenceItemProps) {
  const isInteractive = !!onPress
  const Container = isInteractive ? Pressable : View

  return (
    <>
      <Container
        className={cn(
          'flex-row items-center justify-between py-4',
          isInteractive && 'transition-opacity active:opacity-70',
          className
        )}
        onPress={onPress}
        accessibilityRole={isInteractive ? 'button' : undefined}
      >
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-muted">
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-popover-foreground">
              {title}
            </Text>
            {subtitle && (
              <Text className="mt-0.5 text-sm text-muted-foreground">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement && <View className="ml-3">{rightElement}</View>}
      </Container>
      {showBorder && <View className="ml-13 h-px bg-border/20" />}
    </>
  )
}
