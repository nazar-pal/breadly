import AddExpenseTabBar from '@/components/navigation/AddExpenseTabBar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { withLayoutContext } from 'expo-router'
import React from 'react'

const { Navigator } = createMaterialTopTabNavigator()
const TopTabs = withLayoutContext(Navigator)

export default function AddLayout() {
  return (
    <TopTabs
      /* 👇 put the custom component here */
      tabBar={props => <AddExpenseTabBar {...props} />}
      /* general options */
      screenOptions={{
        swipeEnabled: true
      }}
    >
      <TopTabs.Screen name="index" options={{ title: 'Manual' }} />
      <TopTabs.Screen name="photo" options={{ title: 'Photo' }} />
      <TopTabs.Screen name="voice" options={{ title: 'Voice' }} />
    </TopTabs>
  )
}
