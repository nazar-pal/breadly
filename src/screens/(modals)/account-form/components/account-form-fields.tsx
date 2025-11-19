import { FormDateField, FormInputField } from '@/components/form-fields'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Text } from '@/components/ui/text'
import { AccountType } from '@/data/client/db-schema'
import React, { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { type AccountFormData } from '../lib/form-schemas'
import { OpenBottomSheetPicker } from '../lib/types'
import { BaseFields } from './base-fields'

interface Props {
  formType: 'create' | 'update'
  accountType: AccountType
}

export function AccountFormFields({ formType, accountType }: Props) {
  const form = useFormContext<AccountFormData>()

  const [openPicker, setOpenPicker] = useState<OpenBottomSheetPicker>(null)

  const watchedDebtIsOwedToMe = useWatch({
    control: form.control,
    name: 'debtIsOwedToMe'
  })
  const debtIsOwedToMe =
    accountType === 'debt' ? Boolean(watchedDebtIsOwedToMe) : undefined

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6"
      showsVerticalScrollIndicator={false}
    >
      {accountType === 'debt' && (
        <FormField
          control={form.control}
          name="debtIsOwedToMe"
          render={({ field }) => {
            const selectedValue = field.value ?? true

            return (
              <FormItem>
                <FormLabel>Who owes?</FormLabel>
                <FormControl>
                  <View className="flex-row gap-2">
                    {[
                      { value: false, label: 'I owe' },
                      { value: true, label: 'Owed to me' }
                    ].map(option => (
                      <Pressable
                        key={option.label}
                        className={`flex-1 rounded-xl border py-3 ${
                          selectedValue === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card'
                        }`}
                        onPress={() => field.onChange(option.value)}
                      >
                        <Text
                          className={`text-center text-base font-semibold ${
                            selectedValue === option.value
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      )}

      <BaseFields
        formType={formType}
        accountType={accountType}
        debtIsOwedToMe={debtIsOwedToMe}
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
      />

      {accountType === 'saving' && (
        <>
          <FormInputField
            name="savingsTargetAmount"
            label="Savings goal"
            placeholder="Goal amount"
            kind="number"
          />
          <FormDateField
            name="savingsTargetDate"
            label="Target date"
            placeholder="Target date"
            isPickerOpen={openPicker === 'targetDate'}
            openPicker={() => setOpenPicker('targetDate')}
            closePicker={() => setOpenPicker(null)}
            drawerTitle="Pick target date"
            safeBottomPadding
            height="auto"
          />
        </>
      )}

      {accountType === 'debt' && (
        <>
          <FormInputField
            name="debtInitialAmount"
            label={debtIsOwedToMe ? 'Amount lent' : 'Amount borrowed'}
            placeholder={debtIsOwedToMe ? 'Total lent' : 'Total borrowed'}
            kind="number"
          />

          <FormDateField
            name="debtDueDate"
            label="Due date"
            placeholder="Due date"
            isPickerOpen={openPicker === 'dueDate'}
            openPicker={() => setOpenPicker('dueDate')}
            closePicker={() => setOpenPicker(null)}
            drawerTitle="Pick due date"
            height="auto"
          />
        </>
      )}
    </ScrollView>
  )
}
