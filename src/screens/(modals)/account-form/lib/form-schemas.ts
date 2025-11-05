import {
  accountInsertSchema,
  accountUpdateSchema
} from '@/data/client/db-schema'
import { z } from 'zod'

// ============================================================================
// BASE SCHEMA DEFINITIONS
// ============================================================================
// Create Fields Schema
const commonCreateFieldsSchema = accountInsertSchema
  .pick({
    name: true,
    description: true,
    currencyId: true,
    balance: true,
    isArchived: true
  })
  .extend({
    // Force explicit currency selection in the form (no implicit default)
    currencyId: z.string().min(1, 'Currency is required')
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
const createPaymentAccountFormSchema = commonCreateFieldsSchema
type CreatePaymentAccountFormValues = z.infer<
  typeof createPaymentAccountFormSchema
>

// Update Payment Account Form Schema
const updatePaymentAccountFormSchema = commonUpdateFieldsSchema
type UpdatePaymentAccountFormValues = z.infer<
  typeof updatePaymentAccountFormSchema
>

// ============================================================================
// SAVING ACCOUNT SCHEMAS
// ============================================================================
// Create Saving Account Form Schema
const createSavingAccountFormSchema = commonCreateFieldsSchema.extend({
  savingsTargetAmount: accountInsertSchema.shape.savingsTargetAmount,
  savingsTargetDate: accountInsertSchema.shape.savingsTargetDate
})
type CreateSavingAccountFormValues = z.infer<
  typeof createSavingAccountFormSchema
>

// Update Saving Account Form Schema
const updateSavingAccountFormSchema = commonUpdateFieldsSchema.extend({
  savingsTargetAmount: accountUpdateSchema.shape.savingsTargetAmount,
  savingsTargetDate: accountUpdateSchema.shape.savingsTargetDate
})
type UpdateSavingAccountFormValues = z.infer<
  typeof updateSavingAccountFormSchema
>

// ============================================================================
// DEBT ACCOUNT SCHEMAS
// ============================================================================
// Create Debt Account Form Schema
// Note: debtIsOwedToMe is a local UI field used to control balance sign,
// it is NOT saved to the database
const createDebtAccountFormSchema = commonCreateFieldsSchema.extend({
  debtInitialAmount: accountInsertSchema.shape.debtInitialAmount,
  debtIsOwedToMe: z.boolean().optional(), // Local UI field, not saved to DB
  debtDueDate: accountInsertSchema.shape.debtDueDate
})
type CreateDebtAccountFormValues = z.infer<typeof createDebtAccountFormSchema>

// Update Debt Account Form Schema
// Note: debtIsOwedToMe is a local UI field used to control balance sign,
// it is NOT saved to the database
const updateDebtAccountFormSchema = commonUpdateFieldsSchema.extend({
  debtInitialAmount: accountUpdateSchema.shape.debtInitialAmount,
  debtIsOwedToMe: z.boolean().optional(), // Local UI field, not saved to DB
  debtDueDate: accountUpdateSchema.shape.debtDueDate
})
type UpdateDebtAccountFormValues = z.infer<typeof updateDebtAccountFormSchema>

// ============================================================================
// ACCOUNT FORM VALUES
// ============================================================================

export type CreateAccountData =
  | CreatePaymentAccountFormValues
  | CreateSavingAccountFormValues
  | CreateDebtAccountFormValues

export type UpdateAccountData =
  | UpdatePaymentAccountFormValues
  | UpdateSavingAccountFormValues
  | UpdateDebtAccountFormValues

export type AccountFormData = CreateAccountData | UpdateAccountData

// ============================================================================
// FORM SCHEMAS OBJECT
// ============================================================================

export const formSchemas = {
  payment: {
    create: createPaymentAccountFormSchema,
    update: updatePaymentAccountFormSchema
  },
  saving: {
    create: createSavingAccountFormSchema,
    update: updateSavingAccountFormSchema
  },
  debt: {
    create: createDebtAccountFormSchema,
    update: updateDebtAccountFormSchema
  }
} as const
