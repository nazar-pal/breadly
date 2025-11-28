import { Icon } from '@/components/ui/icon-by-name'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import React, { useState } from 'react'
import { useTransactionParamsActions } from '../../../store'
import type { TransactionParams } from '../../../types'
import { AccountsList } from '../lists/accounts-list'
import { CurrenciesList } from '../lists/currencies-list'

export function AccountOrCurrency({
  params,
  closeModal
}: {
  params: Extract<TransactionParams, { type: 'expense' | 'income' }>
  closeModal: () => void
}) {
  type AccountCurrencyTab = 'account' | 'currency'
  const [tab, setTab] = useState<AccountCurrencyTab>(
    params.accountId !== undefined ? 'account' : 'currency'
  )
  const { setExpenseIncomeParams } = useTransactionParamsActions()

  const handleSelectAccount = (accountId: string) => {
    setExpenseIncomeParams({
      type: params.type,
      categoryId: params.categoryId,
      accountId
    })
    closeModal()
  }
  const handleSelectCurrency = (currencyCode: string) => {
    setExpenseIncomeParams({
      type: params.type,
      categoryId: params.categoryId,
      currencyCode
    })
    closeModal()
  }

  return (
    <Tabs
      value={tab}
      onValueChange={value =>
        setTab(value === 'account' ? 'account' : 'currency')
      }
      className="flex-1"
    >
      <TabsList className="mb-3">
        <TabsTrigger value="account">
          <Icon name="CreditCard" size={14} className="text-foreground mr-1" />
          <Text>Accounts</Text>
        </TabsTrigger>

        <TabsTrigger value="currency">
          <Icon name="DollarSign" size={14} className="text-foreground mr-1" />
          <Text>Currencies</Text>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="flex-1">
        <AccountsList direction="from" onSelect={handleSelectAccount} />
      </TabsContent>

      <TabsContent value="currency" className="flex-1">
        <CurrenciesList onSelect={handleSelectCurrency} />
      </TabsContent>
    </Tabs>
  )
}
