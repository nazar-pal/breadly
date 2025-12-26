import { Form } from '@/components/ui/form'
import { createAccount } from '@/data/client/mutations'
import {
  useAccountModalActions,
  useAccountModalState
} from '@/lib/storage/account-modal-store'
import { toSmallestUnit } from '@/lib/utils/currency-info'
import { useUserSession } from '@/system/session-and-migration'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
  formSchemas,
  isCreateAccountData,
  type AccountFormData,
  type CreateAccountData,
  type UpdateAccountData
} from '../lib/form-schemas'
import { getDefaultValues } from '../lib/get-default-values'
import { updateAccount } from '../lib/update-account'
import { AccountFormActions } from './account-form-actions'
import { AccountFormFields } from './account-form-fields'

/**
 * Converts monetary display amounts to smallest currency unit
 * Returns a new object with converted values (does not mutate input)
 */
function convertMonetaryFields<T extends AccountFormData>(
  data: T,
  currencyId: string
): T {
  const result = { ...data }

  if (result.balance != null)
    result.balance = toSmallestUnit(result.balance, currencyId)

  if ('savingsTargetAmount' in result && result.savingsTargetAmount != null)
    result.savingsTargetAmount = toSmallestUnit(
      result.savingsTargetAmount,
      currencyId
    )

  if ('debtInitialAmount' in result && result.debtInitialAmount != null)
    result.debtInitialAmount = toSmallestUnit(
      result.debtInitialAmount,
      currencyId
    )

  return result
}

/**
 * Applies debt balance sign based on debtIsOwedToMe selector
 * Returns a new object with the UI-only field removed
 */
function applyDebtBalanceSign<T extends AccountFormData>(data: T): T {
  if (!('debtIsOwedToMe' in data)) return data

  const result = { ...data }
  const debtIsOwedToMe = result.debtIsOwedToMe ?? false
  const balance = result.balance ?? 0

  // Apply sign: negative if I owe, positive if owed to me
  if (balance !== 0) {
    result.balance = debtIsOwedToMe ? Math.abs(balance) : -Math.abs(balance)
  }

  // Remove UI-only field before saving
  delete result.debtIsOwedToMe

  return result
}

export function AccountForm() {
  const { accountType, account } = useAccountModalState()
  const { closeAccountModal } = useAccountModalActions()

  const { userId } = useUserSession()

  const isUpdate = account !== null
  const formType = isUpdate ? 'update' : 'create'
  const formSchema = formSchemas[accountType][formType]

  const form = useForm<AccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(account, accountType)
  })

  async function handleCreate(formData: CreateAccountData) {
    // For create, currency comes from form data
    let data = convertMonetaryFields(formData, formData.currencyId)
    if (accountType === 'debt') data = applyDebtBalanceSign(data)

    await createAccount({
      userId,
      data: { ...data, type: accountType }
    })
    closeAccountModal()
  }

  async function handleUpdate(formData: UpdateAccountData) {
    // For update, currency comes from existing account (cannot be changed)
    const currencyId = account!.currencyId
    let data = convertMonetaryFields(formData, currencyId)
    if (accountType === 'debt') data = applyDebtBalanceSign(data)

    await updateAccount({ id: account!.id, userId, data })
    closeAccountModal()
  }

  function handleSubmit(data: AccountFormData) {
    // Type guard narrows based on currencyId presence (required for create, absent for update)
    if (isCreateAccountData(data)) handleCreate(data)
    else handleUpdate(data)
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
