import type { Account } from '@/components/accounts/lib/useAccounts'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import AccountCard from './AccountCard'

interface AccountsListProps {
  accounts: Account[]
  title: string
  emptyMessage?: string
}

export default function AccountsList({
  accounts,
  title,
  emptyMessage = 'No accounts found'
}: AccountsListProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-foreground">
        {title}
      </Text>
      {accounts.length === 0 ? (
        <View className="rounded-xl border border-dashed border-border bg-muted/20 p-8">
          <Text className="text-center text-sm text-muted-foreground">
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 2 }}
          className="gap-4"
        >
          {accounts.map(account => (
            <View key={account.id} className="w-72">
              <AccountCard account={account} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
