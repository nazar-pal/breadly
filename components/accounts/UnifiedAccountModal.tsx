import { Account, useAccounts } from '@/components/accounts/lib/useAccounts'
import React, { useEffect, useState } from 'react'
import { Control, useForm } from 'react-hook-form'
import { DebtFields, PaymentFields, SavingFields } from './account-type-fields'
import BaseAccountModal from './shared/BaseAccountModal'
import CommonAccountFields from './shared/CommonAccountFields'
import ModalFooter from './shared/ModalFooter'

type AccountType = 'saving' | 'payment' | 'debt'

interface UnifiedAccountFormData {
  // Common fields
  name: string
  description: string
  balance: string

  // Saving-specific fields
  savingsTargetAmount: string
  savingsTargetDate: string

  // Debt-specific fields
  debtInitialAmount: string
  debtIsOwedToMe: boolean
  debtDueDate: string
}

interface AccountTypeConfig {
  title: {
    add: string
    edit: string
  }
  extraFields: (props: {
    control: Control<UnifiedAccountFormData>
  }) => React.JSX.Element
  toFormDefaults: (account?: Account) => Partial<UnifiedAccountFormData>
  serialize: (data: UnifiedAccountFormData) => Record<string, any>
}

const accountTypeConfigs: Record<AccountType, AccountTypeConfig> = {
  payment: {
    title: {
      add: 'Add Payment Account',
      edit: 'Edit Payment Account'
    },
    extraFields: ({ control }) => <PaymentFields control={control} />,
    toFormDefaults: () => ({}),
    serialize: () => ({})
  },

  saving: {
    title: {
      add: 'Add Savings Account',
      edit: 'Edit Savings Account'
    },
    extraFields: ({ control }) => <SavingFields control={control} />,
    toFormDefaults: account => ({
      savingsTargetAmount: account?.savingsTargetAmount?.toString() || '',
      savingsTargetDate:
        account?.savingsTargetDate?.toISOString().split('T')[0] || ''
    }),
    serialize: data => {
      const result: Record<string, any> = {}
      if (data.savingsTargetAmount) {
        result.savingsTargetAmount = parseFloat(data.savingsTargetAmount)
      }
      if (data.savingsTargetDate) {
        result.savingsTargetDate = new Date(data.savingsTargetDate)
      }
      return result
    }
  },

  debt: {
    title: {
      add: 'Add Debt Account',
      edit: 'Edit Debt Account'
    },
    extraFields: ({ control }) => <DebtFields control={control} />,
    toFormDefaults: account => ({
      debtInitialAmount: account?.debtInitialAmount?.toString() || '',
      debtIsOwedToMe: account?.debtIsOwedToMe || false,
      debtDueDate: account?.debtDueDate?.toISOString().split('T')[0] || ''
    }),
    serialize: data => {
      const result: Record<string, any> = {}
      if (data.debtInitialAmount) {
        result.debtInitialAmount = parseFloat(data.debtInitialAmount)
      }
      if (data.debtIsOwedToMe !== undefined) {
        result.debtIsOwedToMe = data.debtIsOwedToMe
      }
      if (data.debtDueDate) {
        result.debtDueDate = new Date(data.debtDueDate)
      }
      return result
    }
  }
}

interface UnifiedAccountModalProps {
  visible: boolean
  account: Account | null
  accountType: AccountType
  onClose: () => void
}

export default function UnifiedAccountModal({
  visible,
  account,
  accountType,
  onClose
}: UnifiedAccountModalProps) {
  const { createAccount, updateAccount } = useAccounts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentType = account?.type || accountType
  const config = accountTypeConfigs[currentType]
  const isEditing = !!account

  const { control, handleSubmit, reset } = useForm<UnifiedAccountFormData>({
    defaultValues: {
      name: '',
      description: '',
      balance: '0',
      savingsTargetAmount: '',
      savingsTargetDate: '',
      debtInitialAmount: '',
      debtIsOwedToMe: false,
      debtDueDate: ''
    }
  })

  useEffect(() => {
    if (account) {
      // Editing existing account
      const commonDefaults = {
        name: account.name,
        description: account.description || '',
        balance: account.balance.toString()
      }
      const typeSpecificDefaults = config.toFormDefaults(account)

      reset({
        ...commonDefaults,
        ...typeSpecificDefaults,
        // Reset other type fields to defaults
        savingsTargetAmount: '',
        savingsTargetDate: '',
        debtInitialAmount: '',
        debtIsOwedToMe: false,
        debtDueDate: '',
        // Then apply the specific type defaults
        ...typeSpecificDefaults
      })
    } else {
      // Adding new account
      reset({
        name: '',
        description: '',
        balance: '0',
        savingsTargetAmount: '',
        savingsTargetDate: '',
        debtInitialAmount: '',
        debtIsOwedToMe: false,
        debtDueDate: ''
      })
    }
  }, [account, reset, config])

  const onSubmit = async (data: UnifiedAccountFormData) => {
    setIsSubmitting(true)
    try {
      const baseData = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        balance: parseFloat(data.balance) || 0
      }

      const typeSpecificData = config.serialize(data)
      const finalData = { ...baseData, ...typeSpecificData }

      if (account) {
        await updateAccount({
          id: account.id,
          ...finalData
        })
      } else {
        await createAccount({
          ...finalData,
          type: currentType,
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

  return (
    <BaseAccountModal
      visible={visible}
      title={config.title[isEditing ? 'edit' : 'add']}
      onClose={onClose}
      footerContent={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          isEditing={isEditing}
        />
      }
    >
      <CommonAccountFields control={control} isEditing={isEditing} />
      {config.extraFields({ control })}
    </BaseAccountModal>
  )
}
