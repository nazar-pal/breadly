import { Account, useAccounts } from '@/hooks/useAccounts'
import React, { useEffect, useState } from 'react'
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
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        balance: account.balance.toString(),
        debtInitialAmount: account.debtInitialAmount?.toString() || '',
        debtIsOwedToMe: account.debtIsOwedToMe || false,
        debtDueDate: account.debtDueDate?.toISOString().split('T')[0] || ''
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

  const onSubmit = async (data: DebtAccountFormData) => {
    setIsSubmitting(true)
    try {
      const baseData = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        balance: parseFloat(data.balance) || 0
      }

      const debtData: any = {}
      if (data.debtInitialAmount) {
        debtData.debtInitialAmount = parseFloat(data.debtInitialAmount)
      }
      if (data.debtIsOwedToMe !== undefined) {
        debtData.debtIsOwedToMe = data.debtIsOwedToMe
      }
      if (data.debtDueDate) {
        debtData.debtDueDate = new Date(data.debtDueDate)
      }

      const finalData = { ...baseData, ...debtData }

      if (account) {
        await updateAccount({
          id: account.id,
          ...finalData
        })
      } else {
        await createAccount({
          ...finalData,
          type: 'debt',
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
    return account ? 'Edit Debt Account' : 'Add Debt Account'
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
