import type { Account } from '@/hooks/useAccountManagement'
import { CreditCard, PiggyBank, Receipt } from 'lucide-react-native'
import React, { useState } from 'react'
import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AccountSection from './AccountSection'

interface AccountsTabViewProps {
  accounts: {
    payment: Account[]
    savings: Account[]
    debt: Account[]
  }
  onEditAccount: (account: Account) => void
  onAddAccount: (type: 'payment' | 'savings' | 'debt') => void
}

type TabType = 'payment' | 'savings' | 'debt'

const tabs: { key: TabType; title: string; icon: React.ComponentType<any> }[] =
  [
    { key: 'payment', title: 'Payments', icon: CreditCard },
    { key: 'savings', title: 'Savings', icon: PiggyBank },
    { key: 'debt', title: 'Debt', icon: Receipt }
  ]

export default function AccountsTabView({
  accounts,
  onEditAccount,
  onAddAccount
}: AccountsTabViewProps) {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<TabType>('payment')

  const handleTabPress = (tabKey: TabType) => {
    setActiveTab(tabKey)
  }

  const navigateToTab = (direction: 'previous' | 'next') => {
    const currentTabIndex = tabs.findIndex(tab => tab.key === activeTab)

    if (direction === 'previous' && currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].key)
    } else if (direction === 'next' && currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].key)
    }
  }

  const panGesture = Gesture.Pan()
    .minDistance(30)
    .onEnd(event => {
      'worklet'
      const { translationX, velocityX } = event

      // Require minimum velocity for swipe detection
      if (Math.abs(velocityX) > 200) {
        if (translationX > 30) {
          // Swipe right - go to previous tab
          runOnJS(navigateToTab)('previous')
        } else if (translationX < -30) {
          // Swipe left - go to next tab
          runOnJS(navigateToTab)('next')
        }
      }
    })

  const getActiveTabStyle = () => {
    return {
      backgroundColor: '#6366F1', // colors.primary
      ...Platform.select({
        android: {
          elevation: 3
        },
        default: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // colors.shadow
        }
      })
    }
  }

  const renderTabContent = () => {
    const tabAccounts = accounts[activeTab]
    const sectionTitle = tabs.find(tab => tab.key === activeTab)?.title || ''

    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingHorizontal: 16, paddingTop: 8 },
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <AccountSection
          title={`${sectionTitle} Accounts`}
          accounts={tabAccounts}
          accountType={activeTab}
          onEditAccount={onEditAccount}
          onAddAccount={onAddAccount}
        />
      </ScrollView>
    )
  }

  return (
    <View className="flex-1">
      {/* Tab Navigation */}
      <View className="flex-row gap-2 bg-background px-5 py-3">
        {tabs.map(tab => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.key
          const iconColor = isActive ? '#FFFFFF' : '#4A5568' // colors.textInverse : colors.textSecondary

          return (
            <Pressable
              key={tab.key}
              className="bg-card-secondary min-h-[40px] flex-1 items-center justify-center rounded-2xl px-4 py-2.5"
              style={isActive ? getActiveTabStyle() : undefined}
              onPress={() => handleTabPress(tab.key)}
            >
              <View className="flex-row items-center gap-2">
                <IconComponent size={18} color={iconColor} />
                <Text
                  className="text-center text-sm font-medium"
                  style={{
                    color: isActive ? '#FFFFFF' : '#4A5568', // colors.textInverse : colors.textSecondary
                    fontWeight: isActive ? '600' : '400'
                  }}
                >
                  {tab.title}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </View>

      {/* Tab Content with Swipe Gesture */}
      <GestureDetector gesture={panGesture}>
        <View className="flex-1">{renderTabContent()}</View>
      </GestureDetector>
    </View>
  )
}
