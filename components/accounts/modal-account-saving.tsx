import { Account, useAccounts } from '@/hooks/useAccounts'
import React, { useEffect, useState } from 'react'
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
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        balance: account.balance.toString(),
        savingsTargetAmount: account.savingsTargetAmount?.toString() || '',
        savingsTargetDate:
          account.savingsTargetDate?.toISOString().split('T')[0] || ''
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

  const onSubmit = async (data: SavingAccountFormData) => {
    setIsSubmitting(true)
    try {
      const baseData = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        balance: parseFloat(data.balance) || 0
      }

      const savingsData: any = {}
      if (data.savingsTargetAmount) {
        savingsData.savingsTargetAmount = parseFloat(data.savingsTargetAmount)
      }
      if (data.savingsTargetDate) {
        savingsData.savingsTargetDate = new Date(data.savingsTargetDate)
      }

      const finalData = { ...baseData, ...savingsData }

      if (account) {
        await updateAccount({
          id: account.id,
          ...finalData
        })
      } else {
        await createAccount({
          ...finalData,
          type: 'saving',
          currencyId: 'USD'
        })
      }

      onClose()
    } catch (error) {
      // Error is already handled in the hook with Alert.alert
      console.error('Failed to save account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    return account ? 'Edit Savings Account' : 'Add Savings Account'
  }

  return (
    <BaseAccountModal
      visible={visible}
      title={getTitle()}
      onClose={onClose}
      footerContent={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
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
