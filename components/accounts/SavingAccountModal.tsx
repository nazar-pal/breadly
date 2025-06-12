import { Account, useAccounts } from '@/hooks/useAccounts'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import BaseAccountModal from './shared/BaseAccountModal'
import CommonAccountFields from './shared/CommonAccountFields'
import { CurrencyField, DateField } from './shared/FormFields'
import ModalFooter from './shared/ModalFooter'

interface SavingAccountModalProps {
  visible: boolean
  account: Account | null
  onClose: () => void
}

interface SavingAccountFormData {
  name: string
  description: string
  balance: string
  savingsTargetAmount: string
  savingsTargetDate: string
}

export default function SavingAccountModal({
  visible,
  account,
  onClose
}: SavingAccountModalProps) {
  const { createAccount, updateAccount } = useAccounts()

  const { control, handleSubmit, reset } = useForm<SavingAccountFormData>({
    defaultValues: {
      name: '',
      description: '',
      balance: '0',
      savingsTargetAmount: '',
      savingsTargetDate: ''
    }
  })

  useEffect(() => {
    if (account) {
      // Editing existing account
      reset({
        name: account.name,
        description: account.description || '',
        balance: account.balance,
        savingsTargetAmount: account.savingsTargetAmount || '',
        savingsTargetDate: account.savingsTargetDate || ''
      })
    } else {
      // Adding new account
      reset({
        name: '',
        description: '',
        balance: '0',
        savingsTargetAmount: '',
        savingsTargetDate: ''
      })
    }
  }, [account, reset])

  const onSubmit = (data: SavingAccountFormData) => {
    const baseData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      balance: data.balance
    }

    const savingsData = {
      ...(data.savingsTargetAmount && {
        savingsTargetAmount: data.savingsTargetAmount
      }),
      ...(data.savingsTargetDate && {
        savingsTargetDate: data.savingsTargetDate
      })
    }

    const finalData = { ...baseData, ...savingsData }

    if (account) {
      updateAccount.mutate({
        id: account.id,
        ...finalData
      } as any)
    } else {
      createAccount.mutate({
        ...finalData,
        type: 'saving',
        currencyId: 'USD'
      } as any)
    }

    onClose()
  }

  const getTitle = () => {
    return account ? 'Edit Savings Account' : 'Add Savings Account'
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
        name="savingsTargetAmount"
        label="Savings Goal (Optional)"
      />

      <DateField
        control={control}
        name="savingsTargetDate"
        label="Target Date (Optional)"
      />
    </BaseAccountModal>
  )
}
