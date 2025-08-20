import * as React from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues
} from 'react-hook-form'
import { Text, View, type AccessibilityState } from 'react-native'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

function FormItem({
  className,
  ...props
}: React.ComponentProps<typeof View> & { className?: string }) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <View className={cn('gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error } = useFormField()

  return (
    <Label
      className={cn(error ? 'text-destructive' : undefined, className)}
      {...props}
    />
  )
}

function FormControl<
  TProps extends { nativeID?: string; accessibilityState?: AccessibilityState }
>({ children }: { children: React.ReactElement<TProps> }) {
  const { formItemId, error } = useFormField()

  // If the child is a React Fragment, return it as-is without trying to inject props
  if (children.type === React.Fragment) {
    return children
  }

  const injected = {
    nativeID: formItemId,
    accessibilityState: { invalid: Boolean(error) }
  } as unknown as Partial<TProps>
  return React.cloneElement(children, injected)
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & { className?: string }) {
  const { formDescriptionId } = useFormField()
  return (
    <Text
      nativeID={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  ...props
}: React.ComponentProps<typeof Text> & { className?: string }) {
  const { error, formMessageId } = useFormField()
  const body = error
    ? String(error?.message ?? '')
    : (props.children as React.ReactNode)

  if (!body) {
    return null
  }

  return (
    <Text
      nativeID={formMessageId}
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {body}
    </Text>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
}
