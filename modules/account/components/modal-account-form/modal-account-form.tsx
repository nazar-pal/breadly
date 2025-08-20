import { Modal } from '@/components/modals'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { createAccount, updateAccount } from '../../data'
import { useAccountModalActions, useAccountModalState } from '../../store'
import { AccountForm } from './account-form'
import {
  type AccountFormData,
  type CreateAccountData,
  type UpdateAccountData
} from './schema'

export function ModalAccountForm() {
  const { isAccountModalVisible, accountType, account } = useAccountModalState()
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
    <Modal
      isVisible={isAccountModalVisible}
      onClose={closeAccountModal}
      title={account ? 'Edit Account' : 'Create Account'}
      height="auto"
    >
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
    </Modal>
  )
}
