import { CurrenciesList } from '@/components/currencies-list'
import { Calendar } from '@/components/ui/calendar'
import { Drawer } from '@/components/ui/drawer'
import {
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
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { DateData } from 'react-native-calendars'
import { type AccountFormData } from '../lib/form-schemas'

interface Props {
  formType: 'create' | 'update'
}

export function AccountFormFields({ formType }: Props) {
  const { accountType } = useAccountModalState()

  const form = useFormContext<AccountFormData>()

  const [isTargetDateDrawerOpen, setIsTargetDateDrawerOpen] = useState(false)
  const [isDueDateDrawerOpen, setIsDueDateDrawerOpen] = useState(false)
  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false)

  // Dynamic labels and placeholders (short and mobile-friendly)
  const debtIsOwedToMe =
    accountType === 'debt' ? form.watch('debtIsOwedToMe') : undefined

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-6">
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

      <View className="flex-row gap-2">
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem className="flex-1">
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

        {formType === 'create' && (
          <FormField
            control={form.control}
            name="currencyId"
            render={({ field }) => (
              <FormItem className="flex-[0.4]">
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <>
                    <Pressable
                      className="flex h-10 flex-row items-center rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm shadow-black/5 dark:bg-input/30"
                      onPress={() => setIsCurrencyDrawerOpen(true)}
                    >
                      <Text
                        className={
                          field.value
                            ? 'text-base text-foreground'
                            : 'text-base text-muted-foreground'
                        }
                      >
                        {field.value?.toString() || 'Currency'}
                      </Text>
                    </Pressable>
                    <Drawer
                      isVisible={isCurrencyDrawerOpen}
                      onClose={() => setIsCurrencyDrawerOpen(false)}
                      height="85%"
                      safeBottomPadding={false}
                      title="Select account currency"
                    >
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerClassName="pb-8 px-3"
                      >
                        <CurrenciesList
                          onSelect={currency => {
                            field.onChange(currency.code)
                            setIsCurrencyDrawerOpen(false)
                          }}
                          selectedCurrency={field.value}
                        />
                      </ScrollView>
                    </Drawer>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </View>

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
                      onPress={() => setIsTargetDateDrawerOpen(true)}
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
                      isVisible={isTargetDateDrawerOpen}
                      onClose={() => setIsTargetDateDrawerOpen(false)}
                      safeBottomPadding={true}
                      height="auto"
                      title="Pick target date"
                    >
                      <Calendar
                        date={field.value?.toString() ?? ''}
                        onDayPress={(date: DateData) => {
                          field.onChange(new Date(date.dateString))
                          setIsTargetDateDrawerOpen(false)
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
                      onPress={() => setIsDueDateDrawerOpen(true)}
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
                      isVisible={isDueDateDrawerOpen}
                      onClose={() => setIsDueDateDrawerOpen(false)}
                      height="auto"
                      title="Pick due date"
                    >
                      <Calendar
                        date={field.value?.toString() ?? ''}
                        onDayPress={(date: DateData) => {
                          field.onChange(new Date(date.dateString))
                          setIsDueDateDrawerOpen(false)
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
  )
}
