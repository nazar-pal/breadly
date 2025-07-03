export interface QuickCalculatorProps {
  type: 'expense' | 'income'
  categoryId: string
  onClose: () => void
}

export interface CalcButtonProps {
  label: string | React.ReactNode
  onPress: () => void
  variant?: 'default' | 'operation' | 'equal' | 'special'
  isWide?: boolean
}

export interface CategoryModalProps {
  visible: boolean
  type: 'expense' | 'income'
  categories: {
    id: string
    name: string
    type: string
  }[]
  selectedCategoryId: string
  onSelectCategory: (categoryId: string) => void
  onClose: () => void
}

export interface AccountModalProps {
  visible: boolean
  accounts: {
    id: string
    name: string
    balance?: number
  }[]
  selectedAccountId: string
  onSelectAccount: (accountId: string) => void
  onClose: () => void
}

export interface CommentModalProps {
  visible: boolean
  comment: string
  onChangeComment: (comment: string) => void
  onClose: () => void
}
