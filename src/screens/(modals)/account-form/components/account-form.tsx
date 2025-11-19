import { Form } from '@/components/ui/form'
import { createAccount } from '@/data/client/mutations'
import {
  useAccountModalActions,
  useAccountModalState
} from '@/lib/storage/account-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
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
    // For debt accounts, convert balance sign based on debtIsOwedToMe selector
    // Balance represents remaining debt (always positive in form input)
    // - If "I owe" (debtIsOwedToMe = false): balance should be negative (remaining debt you owe)
    // - If "Owed to me" (debtIsOwedToMe = true): balance should be positive (remaining debt owed to you)
    if (accountType === 'debt' && 'debtIsOwedToMe' in data) {
      const debtIsOwedToMe = data.debtIsOwedToMe ?? false
      const balance = data.balance ?? 0

      // Apply sign based on selector: ensure balance sign matches selector
      if (balance !== 0) {
        const absBalance = Math.abs(balance)
        data.balance = debtIsOwedToMe ? absBalance : -absBalance
      }

      // Remove debtIsOwedToMe from data before saving (it's only a UI field)
      delete data.debtIsOwedToMe
    }

    // UPDATE EXISTING ACCOUNT
    if (account) handleUpdateAccount({ id: account.id, data })
    // CREATE NEW ACCOUNT
    else if ('currencyId' in data) handleCreateAccount(data)
  }

  return (
    <Form {...form}>
      <AccountFormFields formType={formType} accountType={accountType} />
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
