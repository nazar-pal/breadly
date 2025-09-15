import {
  accountInsertSchema,
  accountUpdateSchema
} from '@/data/client/db-schema'
import { z } from 'zod'

// ============================================================================
// BASE SCHEMA DEFINITIONS
// ============================================================================
// Create Fields Schema
const commonCreateFieldsSchema = accountInsertSchema.pick({
  name: true,
  description: true,
  currencyId: true,
  balance: true,
  isArchived: true
})

// Update Fields Schema
const commonUpdateFieldsSchema = accountUpdateSchema.pick({
  name: true,
  description: true,
  balance: true,
  isArchived: true
})

// ============================================================================
// PAYMENT ACCOUNT SCHEMAS
// ============================================================================
// Create Payment Account Form Schema
export const createPaymentAccountFormSchema = commonCreateFieldsSchema
export type CreatePaymentAccountFormValues = z.infer<
  typeof createPaymentAccountFormSchema
>

// Update Payment Account Form Schema
export const updatePaymentAccountFormSchema = commonUpdateFieldsSchema
export type UpdatePaymentAccountFormValues = z.infer<
  typeof updatePaymentAccountFormSchema
>

export type PaymentFormData =
  | CreatePaymentAccountFormValues
  | UpdatePaymentAccountFormValues

// ============================================================================
// SAVING ACCOUNT SCHEMAS
// ============================================================================
// Create Saving Account Form Schema
export const createSavingAccountFormSchema = commonCreateFieldsSchema.extend({
  savingsTargetAmount: accountInsertSchema.shape.savingsTargetAmount,
  savingsTargetDate: accountInsertSchema.shape.savingsTargetDate
})
export type CreateSavingAccountFormValues = z.infer<
  typeof createSavingAccountFormSchema
>

// Update Saving Account Form Schema
export const updateSavingAccountFormSchema = commonUpdateFieldsSchema.extend({
  savingsTargetAmount: accountUpdateSchema.shape.savingsTargetAmount,
  savingsTargetDate: accountUpdateSchema.shape.savingsTargetDate
})
export type UpdateSavingAccountFormValues = z.infer<
  typeof updateSavingAccountFormSchema
>

export type SavingFormData =
  | CreateSavingAccountFormValues
  | UpdateSavingAccountFormValues

// ============================================================================
// DEBT ACCOUNT SCHEMAS
// ============================================================================
// Create Debt Account Form Schema
export const createDeptAccountFormSchema = commonCreateFieldsSchema.extend({
  debtInitialAmount: accountInsertSchema.shape.debtInitialAmount,
  debtIsOwedToMe: accountInsertSchema.shape.debtIsOwedToMe,
  debtDueDate: accountInsertSchema.shape.debtDueDate
})
export type CreateDeptAccountFormValues = z.infer<
  typeof createDeptAccountFormSchema
>

// Update Debt Account Form Schema
export const updateDeptAccountFormSchema = commonUpdateFieldsSchema.extend({
  debtInitialAmount: accountUpdateSchema.shape.debtInitialAmount,
  debtIsOwedToMe: accountUpdateSchema.shape.debtIsOwedToMe,
  debtDueDate: accountUpdateSchema.shape.debtDueDate
})
export type UpdateDeptAccountFormValues = z.infer<
  typeof updateDeptAccountFormSchema
>

export type DebtFormData =
  | CreateDeptAccountFormValues
  | UpdateDeptAccountFormValues

// ============================================================================
// ACCOUNT FORM VALUES
// ============================================================================

export type CreateAccountData =
  | CreatePaymentAccountFormValues
  | CreateSavingAccountFormValues
  | CreateDeptAccountFormValues

export type UpdateAccountData =
  | UpdatePaymentAccountFormValues
  | UpdateSavingAccountFormValues
  | UpdateDeptAccountFormValues

export type AccountFormData = CreateAccountData | UpdateAccountData
