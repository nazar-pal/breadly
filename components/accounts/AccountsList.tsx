import { Text } from '@/components/ui/text'
import { Account } from '@/powersync/schema/table_6_accounts'
import React from 'react'
import { ScrollView, View } from 'react-native'
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
