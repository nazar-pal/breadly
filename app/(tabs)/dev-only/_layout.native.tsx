import { TopTabBar } from '@/components/dev-only/top-tab-bar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { withLayoutContext } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const { Navigator } = createMaterialTopTabNavigator()
const TopTabs = withLayoutContext(Navigator)

export default function DevOnlyLayout() {
  if (!__DEV__) return null
  return (
    <SafeAreaView className="flex-1">
      <TopTabs
        /* 👇 put the custom component here */
        tabBar={props => <TopTabBar {...props} />}
        /* general options */
        screenOptions={{ swipeEnabled: true }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Local Store' }} />{' '}
        <TopTabs.Screen name="db" options={{ title: 'Database' }} />
        <TopTabs.Screen name="purchases" options={{ title: 'Purchases' }} />
      </TopTabs>
    </SafeAreaView>
  )
}
