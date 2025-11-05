import { useAccountModalState } from '@/lib/storage/account-modal-store'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { type AccountFormData } from '../lib/form-schemas'
import { OpenBottomSheetPicker } from '../lib/types'
import { BaseFields } from './base-fields'
import { DebtFields } from './debt-fields'
import { SavingsFields } from './savings-fields'

interface Props {
  formType: 'create' | 'update'
}

export function AccountFormFields({ formType }: Props) {
  const { accountType } = useAccountModalState()

  const form = useFormContext<AccountFormData>()

  const [openPicker, setOpenPicker] = useState<OpenBottomSheetPicker>(null)

  const debtIsOwedToMe: boolean | null | undefined =
    accountType === 'debt' ? form.watch('debtIsOwedToMe') : undefined

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-6">
      <BaseFields
        formType={formType}
        accountType={accountType}
        debtIsOwedToMe={debtIsOwedToMe}
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
      />

      {accountType === 'saving' && (
        <SavingsFields openPicker={openPicker} setOpenPicker={setOpenPicker} />
      )}

      {accountType === 'debt' && (
        <DebtFields
          debtIsOwedToMe={debtIsOwedToMe}
          openPicker={openPicker}
          setOpenPicker={setOpenPicker}
        />
      )}
    </ScrollView>
  )
}
