import type { Account } from '@/hooks/useAccountManagement'
import React from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AccountSection from './AccountSection'

interface AccountsListProps {
  accounts: {
    payment: Account[]
    savings: Account[]
    debt: Account[]
  }
  onEditAccount: (account: Account) => void
  onAddAccount: (type: 'payment' | 'savings' | 'debt') => void
}

interface SectionConfig {
  type: 'payment' | 'savings' | 'debt'
  title: string
}

const SECTIONS: SectionConfig[] = [
  { type: 'payment', title: 'Payment Accounts' },
  { type: 'savings', title: 'Savings Accounts' },
  { type: 'debt', title: 'Debt Accounts' }
]

export default function AccountsList({
  accounts,
  onEditAccount,
  onAddAccount
}: AccountsListProps) {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      className="bg-background flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: insets.bottom + 20
      }}
    >
      {SECTIONS.map(section => (
        <AccountSection
          key={section.type}
          title={section.title}
          accounts={accounts[section.type]}
          accountType={section.type}
          onEditAccount={onEditAccount}
          onAddAccount={onAddAccount}
        />
      ))}
    </ScrollView>
  )
}
