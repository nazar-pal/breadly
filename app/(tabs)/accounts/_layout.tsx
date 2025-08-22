import { AccountTypesTabBar, AccountsSettingsModal } from '@/modules/account/'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { withLayoutContext } from 'expo-router'
import React from 'react'

const { Navigator } = createMaterialTopTabNavigator()
const TopTabs = withLayoutContext(Navigator)

export default function AccountsLayout() {
  return (
    <>
      <TopTabs
        /* 👇 put the custom component here */
        tabBar={props => <AccountTypesTabBar {...props} />}
        /* general options */
        screenOptions={{
          swipeEnabled: true
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Payments' }} />
        <TopTabs.Screen name="savings" options={{ title: 'Savings' }} />
        <TopTabs.Screen name="debt" options={{ title: 'Debt' }} />
      </TopTabs>
      <AccountsSettingsModal />
    </>
  )
}
