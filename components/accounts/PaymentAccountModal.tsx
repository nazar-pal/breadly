import { Account, useAccounts } from '@/hooks/useAccounts'
import React, { useEffect } from 'react'
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
        balance: account.balance
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

  const onSubmit = (data: PaymentAccountFormData) => {
    const finalData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      balance: data.balance
    }

    if (account) {
      updateAccount.mutate({
        id: account.id,
        ...finalData
      } as any)
    } else {
      createAccount.mutate({
        ...finalData,
        type: 'payment',
        currencyId: 'USD'
      } as any)
    }

    onClose()
  }

  const getTitle = () => {
    return account ? 'Edit Payment Account' : 'Add Payment Account'
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
    </BaseAccountModal>
  )
}
