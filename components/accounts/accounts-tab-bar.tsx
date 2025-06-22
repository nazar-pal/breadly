import { CreditCard, PiggyBank, Receipt } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ICONS = { index: CreditCard, savings: PiggyBank, debt: Receipt }

export function AccountsTabBar({ state, navigation }: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="border-b border-border bg-background"
      style={{ paddingTop: insets.top }}
    >
      {/* Title */}
      <Text className="px-4 pb-4 text-[32px] font-bold tracking-tight text-foreground">
        Accounts
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
                  ? 'Payments'
                  : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
