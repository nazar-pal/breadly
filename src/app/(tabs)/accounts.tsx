import { Icon, type IconName } from '@/components/ui/lucide-icon-by-name'
import { type AccountType } from '@/data/client/db-schema'
import { cn } from '@/lib/utils'
import TabsAccountsScreen from '@/screens/(tabs)/accounts'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

function TabBarIcon({ icon, focused }: { icon: IconName; focused: boolean }) {
  const className = cn('text-muted-foreground', focused && 'text-primary')
  return <Icon name={icon} size={20} className={className} />
}

const tabs: { type: AccountType; title: string; icon: IconName }[] = [
  { type: 'payment', title: 'Payments', icon: 'CreditCard' },
  { type: 'saving', title: 'Savings', icon: 'PiggyBank' },
  { type: 'debt', title: 'Debt', icon: 'Receipt' }
]

export default function AccountsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{ tabBarItemStyle: { flexDirection: 'row' } }}
    >
      {tabs.map(({ type, title, icon }) => (
        <Tab.Screen
          key={type}
          name={type}
          options={{
            title,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon={icon} focused={focused} />
            )
          }}
        >
          {() => <TabsAccountsScreen accountType={type} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  )
}
