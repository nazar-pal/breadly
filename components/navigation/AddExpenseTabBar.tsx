import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { Camera, Mic, Pencil } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const ICONS = { index: Pencil, photo: Camera, voice: Mic }

export default function AddExpenseTabBar({
  state,
  navigation
}: MaterialTopTabBarProps) {
  return (
    <View
      className="border-b pb-2 pt-12"
      style={{
        backgroundColor: '#F5F5F5',
        borderBottomColor: '#F7FAFC'
      }}
    >
      {/* Title */}
      <Text className="mb-4 px-4 text-[32px] font-bold tracking-tight text-foreground">
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
              className="flex-1 flex-row items-center justify-center py-3"
              style={[
                focused && {
                  borderBottomWidth: 2,
                  borderBottomColor: '#6366F1'
                }
              ]}
              onPress={onPress}
            >
              <Icon
                size={20}
                color={focused ? '#6366F1' : '#4A5568'}
                style={{ marginRight: 6 }}
              />
              <Text
                className="text-base"
                style={{
                  color: focused ? '#6366F1' : '#4A5568',
                  fontWeight: focused ? '600' : '400'
                }}
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
