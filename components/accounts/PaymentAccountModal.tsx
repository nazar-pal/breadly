import { Account, useAccounts } from '@/hooks/useAccounts'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import BaseAccountModal from './shared/BaseAccountModal'
import CommonAccountFields from './shared/CommonAccountFields'
import ModalFooter from './shared/ModalFooter'

interface PaymentAccountModalProps {
  visible: boolean
  account: Account | null
  onClose: () => void
}

interface PaymentAccountFormData {
  name: string
  description: string
  balance: string
}

export default function PaymentAccountModal({
  visible,
  account,
  onClose
}: PaymentAccountModalProps) {
  const { createAccount, updateAccount } = useAccounts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset } = useForm<PaymentAccountFormData>({
    defaultValues: {
      name: '',
      description: '',
      balance: '0'
    }
  })

  useEffect(() => {
    if (account) {
      // Editing existing account
      reset({
        name: account.name,
        description: account.description || '',
        balance: account.balance.toString()
      })
    } else {
      // Adding new account
      reset({
        name: '',
        description: '',
        balance: '0'
      })
    }
  }, [account, reset])

  const onSubmit = async (data: PaymentAccountFormData) => {
    setIsSubmitting(true)
    try {
      const finalData = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        balance: parseFloat(data.balance) || 0
      }

      if (account) {
        await updateAccount({
          id: account.id,
          ...finalData
        })
      } else {
        await createAccount({
          ...finalData,
          type: 'payment',
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
    return account ? 'Edit Payment Account' : 'Add Payment Account'
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
    </BaseAccountModal>
  )
}
