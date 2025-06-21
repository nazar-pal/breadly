import { AccountSelectSQLite } from '@/lib/powersync/schema/table_6_accounts'
import { useAccountModalStore } from './account-modal-store'

export function useAccountsUI() {
  const { openForCreate, openForEdit, close } = useAccountModalStore()

  const handleEditAccount = (account: AccountSelectSQLite) => {
    openForEdit(account)
  }

  const handleAddAccount = (type: 'saving' | 'payment' | 'debt') => {
    openForCreate(type)
  }

  const handleCloseModal = () => {
    close()
  }

  return {
    handleEditAccount,
    handleAddAccount,
    handleCloseModal
  }
}
