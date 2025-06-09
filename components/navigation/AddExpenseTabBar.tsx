import { Camera, Mic, Pencil } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ICONS = { index: Pencil, photo: Camera, voice: Mic }

export default function AddExpenseTabBar({
  state,
  navigation
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="bg-background border-border border-b"
      style={{ paddingTop: insets.top }}
    >
      {/* Title */}
      <Text className="text-foreground px-4 pb-4 text-[32px] font-bold tracking-tight">
        Add Expense
      </Text>

      {/* Mode selector */}
      <View className="flex-row">
        {state.routes.map((route, i) => {
          const focused = state.index === i
          const Icon = ICONS[route.name as keyof typeof ICONS]

          const onPress = () => {
            if (!focused) navigation.navigate(route.name)
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              className={cn(
                'flex-1 flex-row items-center justify-center py-3',
                focused && 'border-primary border-b-2'
              )}
              onPress={onPress}
            >
              <Icon
                size={20}
                className={cn(
                  'mr-1.5',
                  focused ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <Text
                className={cn(
                  'text-base',
                  focused
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground font-normal'
                )}
              >
                {route.name === 'index'
                  ? 'Manual'
                  : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
