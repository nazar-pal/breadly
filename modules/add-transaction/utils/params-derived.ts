import type {
  Direction,
  TabKey,
  TransactionParams,
  TransactionParams as TxParams
} from '../types'

export function decideInitialTab(
  direction: Direction,
  params: TxParams
): TabKey {
  switch (direction) {
    case 'from':
      if (params.type === 'transfer') return 'account'
      if (params.accountId) return 'account'
      if (params.currencyCode) return 'currency'
      return 'account'

    case 'to':
      if (params.type === 'transfer') return 'account'
      if (params.categoryId) return 'category'
      return 'category'
  }
}

export type SelectionSlot =
  | {
      kind: Extract<TabKey, 'account'>
      accountId: string | null
      type: TransactionParams['type']
      direction: Direction
    }
  | {
      kind: Extract<TabKey, 'currency'>
      currencyCode: string | null
      type: Extract<TransactionParams['type'], 'expense' | 'income'>
      direction: Extract<Direction, 'from'>
    }
  | {
      kind: Extract<TabKey, 'category'>
      categoryId: string | null
      type: Extract<TransactionParams['type'], 'expense' | 'income'>
      direction: Extract<Direction, 'to'>
    }

export function getSelectionSlot(
  direction: Direction,
  params: TxParams
): SelectionSlot {
  switch (direction) {
    case 'from': {
      if (params.type === 'transfer')
        return {
          kind: 'account',
          accountId: params.fromAccountId,
          type: params.type,
          direction
        }
      if (params.accountId !== undefined)
        return {
          kind: 'account',
          accountId: params.accountId,
          type: params.type,
          direction
        }
      return {
        kind: 'currency',
        currencyCode: params.currencyCode,
        type: params.type,
        direction
      }
    }

    case 'to': {
      if (params.type === 'transfer')
        return {
          kind: 'account',
          accountId: params.toAccountId,
          type: params.type,
          direction
        }
      return {
        kind: 'category',
        categoryId: params.categoryId,
        type: params.type,
        direction
      }
    }
  }
}
