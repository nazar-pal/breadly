import { Form } from '@/components/ui/form'
import {
  useAccountModalActions,
  useAccountModalState
} from '@/lib/storage/account-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { createAccount } from '../lib/create-account'
import {
  formSchemas,
  type AccountFormData,
  type CreateAccountData,
  type UpdateAccountData
} from '../lib/form-schemas'
import { getDefaultValues } from '../lib/get-default-values'
import { updateAccount } from '../lib/update-account'
import { AccountFormActions } from './account-form-actions'
import { AccountFormFields } from './account-form-fields'

export function AccountForm() {
  const { accountType, account } = useAccountModalState()
  const { closeAccountModal } = useAccountModalActions()

  const { userId } = useUserSession()

  const formType = account ? 'update' : 'create'
  const formSchema = formSchemas[accountType][formType]

  const form = useForm<AccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(account, accountType)
  })

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

  function handleSubmit(data: AccountFormData) {
    // UPDATE EXISTING ACCOUNT
    if (account) handleUpdateAccount({ id: account.id, data })
    // CREATE NEW ACCOUNT ()
    else if ('currencyId' in data) handleCreateAccount(data)
  }

  return (
    <Form {...form}>
      <AccountFormFields formType={formType} />
      <AccountFormActions
        onCancel={closeAccountModal}
        onSubmit={form.handleSubmit(handleSubmit)}
        submitLabel={formType === 'update' ? 'Save Changes' : 'Create Account'}
        disabled={!form.formState.isValid}
        isSubmitting={form.formState.isSubmitting}
      />
    </Form>
  )
}
