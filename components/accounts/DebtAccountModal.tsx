import { Account, useAccounts } from '@/hooks/useAccounts'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import BaseAccountModal from './shared/BaseAccountModal'
import CommonAccountFields from './shared/CommonAccountFields'
import { CurrencyField, DateField, ToggleField } from './shared/FormFields'
import ModalFooter from './shared/ModalFooter'

interface DebtAccountModalProps {
  visible: boolean
  account: Account | null
  onClose: () => void
}

interface DebtAccountFormData {
  name: string
  description: string
  balance: string
  debtInitialAmount: string
  debtIsOwedToMe: boolean
  debtDueDate: string
}

export default function DebtAccountModal({
  visible,
  account,
  onClose
}: DebtAccountModalProps) {
  const { createAccount, updateAccount } = useAccounts()

  const { control, handleSubmit, reset } = useForm<DebtAccountFormData>({
    defaultValues: {
      name: '',
      description: '',
      balance: '0',
      debtInitialAmount: '',
      debtIsOwedToMe: false,
      debtDueDate: ''
    }
  })

  useEffect(() => {
    if (account) {
      // Editing existing account
      reset({
        name: account.name,
        description: account.description || '',
        balance: account.balance,
        debtInitialAmount: account.debtInitialAmount || '',
        debtIsOwedToMe: account.debtIsOwedToMe || false,
        debtDueDate: account.debtDueDate || ''
      })
    } else {
      // Adding new account
      reset({
        name: '',
        description: '',
        balance: '0',
        debtInitialAmount: '',
        debtIsOwedToMe: false,
        debtDueDate: ''
      })
    }
  }, [account, reset])

  const onSubmit = (data: DebtAccountFormData) => {
    const baseData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      balance: data.balance
    }

    const debtData = {
      ...(data.debtInitialAmount && {
        debtInitialAmount: data.debtInitialAmount
      }),
      ...(data.debtIsOwedToMe !== undefined && {
        debtIsOwedToMe: data.debtIsOwedToMe
      }),
      ...(data.debtDueDate && { debtDueDate: data.debtDueDate })
    }

    const finalData = { ...baseData, ...debtData }

    if (account) {
      updateAccount.mutate({
        id: account.id,
        ...finalData
      } as any)
    } else {
      createAccount.mutate({
        ...finalData,
        type: 'debt',
        currencyId: 'USD'
      } as any)
    }

    onClose()
  }

  const getTitle = () => {
    return account ? 'Edit Debt Account' : 'Add Debt Account'
  }

  const isLoading = createAccount.isPending || updateAccount.isPending

  return (
    <BaseAccountModal
      visible={visible}
      title={getTitle()}
      onClose={onClose}
      footerContent={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isLoading}
          isEditing={!!account}
        />
      }
    >
      <CommonAccountFields control={control} isEditing={!!account} />

      <CurrencyField
        control={control}
        name="debtInitialAmount"
        label="Original Debt Amount"
        description="How much was originally borrowed or owed?"
      />

      <ToggleField
        control={control}
        name="debtIsOwedToMe"
        label="Debt Direction"
        description="Is this money someone owes you, or money you owe?"
        options={[
          { value: false, label: 'I Owe Money' },
          { value: true, label: 'Owed To Me' }
        ]}
      />

      <DateField
        control={control}
        name="debtDueDate"
        label="Due Date (Optional)"
      />
    </BaseAccountModal>
  )
}
