import {
  useAccountModalActions,
  useAccountModalState
} from '@/lib/storage/account-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { createAccount } from '../lib/create-account'
import {
  type AccountFormData,
  type CreateAccountData,
  type UpdateAccountData
} from '../lib/form-schemas'
import { updateAccount } from '../lib/update-account'
import { AccountForm } from './form'

export function AccountFormModal() {
  const { accountType, account } = useAccountModalState()
  const { closeAccountModal } = useAccountModalActions()

  const { userId } = useUserSession()

  async function handleCreateAccount(data: CreateAccountData) {
    await createAccount({
      userId,
      data: { ...data, type: accountType }
    })

    closeAccountModal()
  }

  async function handleUpdateAccount({
    id,
    data
  }: {
    id: string
    data: UpdateAccountData
  }) {
    await updateAccount({ id, userId, data })
    closeAccountModal()
  }

  function isCreateAccountData(
    data: AccountFormData
  ): data is CreateAccountData {
    return 'currencyId' in data
  }

  return (
    <AccountForm
      onCancel={closeAccountModal}
      onSubmit={data => {
        if (account) {
          handleUpdateAccount({
            id: account.id,
            data
          })
        } else {
          if (!isCreateAccountData(data)) return
          handleCreateAccount(data)
        }
      }}
    />
  )
}
