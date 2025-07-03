import { Camera, Mic, Pencil } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const ICONS = { index: Pencil, photo: Camera, voice: Mic }

export function AddExpenseTabBar({
  state,
  navigation
}: MaterialTopTabBarProps) {
  return (
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
              focused && 'border-b-2 border-primary'
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
                  ? 'font-semibold text-primary'
                  : 'font-normal text-muted-foreground'
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
  )
}
