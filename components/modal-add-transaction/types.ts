export interface Category {
  id: string
  name: string
  type: string
  parentId: string | null
  icon: string
}

export interface CategoryModalProps {
  visible: boolean
  type: 'expense' | 'income'
  categories: Category[]
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
