import { useTheme } from '@/context/ThemeContext'
import type { Account } from '@/hooks/useAccountManagement'
import { CreditCard, PiggyBank, Receipt } from 'lucide-react-native'
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
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
  const { colors } = useTheme()
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

  const renderTabContent = () => {
    const tabAccounts = accounts[activeTab]
    const sectionTitle = tabs.find(tab => tab.key === activeTab)?.title || ''

    return (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
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
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={[styles.tabBar, { backgroundColor: colors.background }]}>
        {tabs.map(tab => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.key
          const iconColor = isActive ? colors.textInverse : colors.textSecondary

          return (
            <Pressable
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: colors.surfaceSecondary },
                isActive && [
                  styles.activeTab,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.shadow
                  }
                ]
              ]}
              onPress={() => handleTabPress(tab.key)}
            >
              <View style={styles.tabContent}>
                <IconComponent size={18} color={iconColor} />
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textSecondary },
                    isActive && [
                      styles.activeTabText,
                      { color: colors.textInverse }
                    ]
                  ]}
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
        <View style={styles.contentContainer}>{renderTabContent()}</View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40
  },
  activeTab: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  },
  activeTabText: {
    fontWeight: '600'
  },
  contentContainer: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8
  }
})
