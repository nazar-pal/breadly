import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import type {
  AccountSelectSQLite,
  CategorySelectSQLite,
  CurrencySelectSQLite
} from '@/data/client/db-schema'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import React from 'react'
import type { SelectableRowProps } from '../types'

type AccountWithCurrency = AccountSelectSQLite & {
  currency: {
    code: CurrencySelectSQLite['code']
    symbol: CurrencySelectSQLite['symbol']
  }
}

export function mapAccountToSelectableRow(
  account: AccountWithCurrency,
  selectedAccountId: string | null | undefined,
  onSelect: (accountId: string) => void
): SelectableRowProps {
  return {
    itemKey: account.id,
    selected: account.id === selectedAccountId,
    onPress: () => onSelect(account.id),
    leftElement: account.currency.symbol,
    title: account.name,
    rightElement: formatCurrencyWithSign(account.balance, account.currency.code)
  }
}

export function mapCurrencyToSelectableRow(
  currency: CurrencySelectSQLite,
  selectedCurrencyCode: string | null | undefined,
  onSelect: (currencyCode: string) => void
): SelectableRowProps {
  return {
    itemKey: currency.code,
    selected: currency.code === selectedCurrencyCode,
    onPress: () => onSelect(currency.code),
    leftElement: currency.symbol,
    title: currency.code,
    subtitle: currency.name
  }
}

export function mapCategoryToSelectableRow(
  category: CategorySelectSQLite,
  selectedCategoryId: string | null | undefined,
  onSelect: (categoryId: string) => void
): SelectableRowProps {
  return {
    itemKey: category.id,
    selected: category.id === selectedCategoryId,
    onPress: () => onSelect(category.id),
    leftElement: (
      <Icon name={category.icon} size={14} className="text-primary" />
    ),
    title: (
      <Text className="text-md" numberOfLines={2} ellipsizeMode="tail">
        {category.name}
      </Text>
    )
  }
}
