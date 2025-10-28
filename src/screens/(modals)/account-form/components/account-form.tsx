import { Calendar } from '@/components/ui/calendar'
import { Drawer } from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAccountModalState } from '@/lib/storage/account-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { DateData } from 'react-native-calendars'
import {
  createDeptAccountFormSchema,
  createPaymentAccountFormSchema,
  createSavingAccountFormSchema,
  updateDeptAccountFormSchema,
  updatePaymentAccountFormSchema,
  updateSavingAccountFormSchema,
  type AccountFormData
} from '../schema'
import { AccountFormActionButtons } from './account-form-action-buttons'

interface Props {
  onCancel: () => void
  onSubmit: (data: AccountFormData) => void
}

const config = {
  payment: {
    createSchema: createPaymentAccountFormSchema,
    updateSchema: updatePaymentAccountFormSchema
  },
  saving: {
    createSchema: createSavingAccountFormSchema,
    updateSchema: updateSavingAccountFormSchema
  },
  debt: {
    createSchema: createDeptAccountFormSchema,
    updateSchema: updateDeptAccountFormSchema
  }
} as const

export function AccountForm({ onCancel, onSubmit }: Props) {
  const { account, accountType } = useAccountModalState()
  const isEditing = Boolean(account)

  const createSchema = config[accountType].createSchema
  const updateSchema = config[accountType].updateSchema

  const formSchema = isEditing ? updateSchema : createSchema

  const form = useForm<AccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name,
      description: account?.description,
      balance: account?.balance,
      isArchived: account?.isArchived,

      ...(isEditing ? {} : { currencyId: 'USD' }),

      ...(accountType === 'saving'
        ? {
            savingsTargetAmount: account?.savingsTargetAmount,
            savingsTargetDate: account?.savingsTargetDate
          }
        : {}),

      ...(accountType === 'debt'
        ? {
            debtInitialAmount: account?.debtInitialAmount,
            debtIsOwedToMe: account?.debtIsOwedToMe,
            debtDueDate: account?.debtDueDate
          }
        : {})
    }
  })

  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  // Dynamic labels and placeholders (short and mobile-friendly)
  const debtIsOwedToMe =
    accountType === 'debt' ? form.watch('debtIsOwedToMe') : undefined

  return (
    <Form {...form}>
      <ScrollView className="flex-1 gap-6 ">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  value={String(field.value ?? '')}
                  onChangeText={field.onChange}
                  autoFocus
                  placeholder="Account name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input
                  value={String(field.value ?? '')}
                  onChangeText={field.onChange}
                  placeholder="Optional description"
                  multiline
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {accountType === 'debt'
                  ? debtIsOwedToMe
                    ? 'Received (optional)'
                    : 'Repaid (optional)'
                  : 'Balance (optional)'}
              </FormLabel>
              <FormControl>
                <Input
                  value={String(field.value ?? '')}
                  onChangeText={text =>
                    field.onChange(text === '' ? undefined : Number(text))
                  }
                  placeholder={
                    accountType === 'debt'
                      ? debtIsOwedToMe
                        ? 'Amount received'
                        : 'Amount repaid'
                      : 'Amount'
                  }
                  keyboardType="decimal-pad"
                />
              </FormControl>
              {accountType === 'debt' ? (
                <FormDescription>
                  {debtIsOwedToMe
                    ? 'Amount received so far. Not remaining debt.'
                    : 'Amount repaid so far. Not remaining debt.'}
                </FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        {accountType === 'saving' && (
          <>
            <FormField
              control={form.control}
              name="savingsTargetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Savings goal (optional)</FormLabel>
                  <FormControl>
                    <Input
                      value={String(field.value ?? '')}
                      onChangeText={text =>
                        field.onChange(text === '' ? undefined : Number(text))
                      }
                      placeholder="Goal amount"
                      keyboardType="decimal-pad"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savingsTargetDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target date (optional)</FormLabel>
                  <FormControl>
                    <>
                      <Pressable
                        className="native:h-12 h-10 flex-row items-center rounded-md border border-input bg-background px-3"
                        onPress={() => setOpen(true)}
                      >
                        <Text
                          className={
                            field.value
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {field.value?.toString() || 'Target date'}
                        </Text>
                      </Pressable>
                      <Drawer
                        isVisible={open}
                        onClose={() => setOpen(false)}
                        height="auto"
                        showDragIndicator={false}
                        title="Pick target date"
                      >
                        <Calendar
                          date={field.value?.toString() ?? ''}
                          onDayPress={(date: DateData) => {
                            field.onChange(new Date(date.dateString))
                            setOpen(false)
                          }}
                        />
                      </Drawer>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {accountType === 'debt' && (
          <>
            <FormField
              control={form.control}
              name="debtInitialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {debtIsOwedToMe
                      ? 'Amount lent (optional)'
                      : 'Amount borrowed (optional)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={String(field.value ?? '')}
                      onChangeText={text =>
                        field.onChange(text === '' ? undefined : Number(text))
                      }
                      placeholder={
                        debtIsOwedToMe ? 'Total lent' : 'Total borrowed'
                      }
                      keyboardType="decimal-pad"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="debtIsOwedToMe"
              render={({ field }) => (
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
                            field.value === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card'
                          }`}
                          onPress={() => field.onChange(option.value)}
                        >
                          <Text
                            className={`text-center text-base font-semibold ${
                              field.value === option.value
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
              )}
            />
            <FormField
              control={form.control}
              name="debtDueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date (optional)</FormLabel>
                  <FormControl>
                    <>
                      <Pressable
                        className="native:h-12 h-10 flex-row items-center rounded-md border border-input bg-background px-3"
                        onPress={() => setOpen2(true)}
                      >
                        <Text
                          className={
                            field.value
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {field.value?.toString() || 'Due date'}
                        </Text>
                      </Pressable>
                      <Drawer
                        isVisible={open2}
                        onClose={() => setOpen2(false)}
                        showDragIndicator={false}
                        height="auto"
                        title="Pick due date"
                      >
                        <Calendar
                          date={field.value?.toString() ?? ''}
                          onDayPress={(date: DateData) => {
                            field.onChange(new Date(date.dateString))
                            setOpen2(false)
                          }}
                        />
                      </Drawer>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </ScrollView>
      <AccountFormActionButtons
        onCancel={onCancel}
        onSubmit={form.handleSubmit(onSubmit)}
        submitLabel={account ? 'Save Changes' : 'Create Account'}
        disabled={!form.formState.isValid}
        isSubmitting={form.formState.isSubmitting}
      />
    </Form>
  )
}
