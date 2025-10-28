import { updateAccount } from '@/data/client/mutations/update-account'
import {
  useAccountModalActions,
  useAccountModalState
} from '@/lib/storage/account-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import {
  type AccountFormData,
  type CreateAccountData,
  type UpdateAccountData
} from '../schema'
import { createAccount } from '../utils/create-account'
import { AccountForm } from './account-form'

export function ModalAccountForm() {
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
