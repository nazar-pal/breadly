import {
  accountInsertSchema,
  accountUpdateSchema
} from '@/data/client/db-schema'
import { z } from 'zod'

// ============================================================================
// BASE SCHEMA DEFINITIONS
// ============================================================================
// Form schemas accept display amounts (floats), conversion to smallest unit
// happens in form submission handler before data reaches the mutation/db schema

// Create Fields Schema
const commonCreateFieldsSchema = accountInsertSchema
  .pick({
    name: true,
    description: true,
    currencyId: true,
    isArchived: true
  })
  .extend({
    // Force explicit currency selection in the form (no implicit default)
    currencyId: z.string().min(1, 'Currency is required'),
    // Form accepts display amounts (floats), converted to integers on submit
    balance: z.number().optional()
  })

// Update Fields Schema
const commonUpdateFieldsSchema = accountUpdateSchema
  .pick({
    name: true,
    description: true,
    isArchived: true
  })
  .extend({
    // Form accepts display amounts (floats), converted to integers on submit
    balance: z.number().optional()
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
  // Form accepts display amounts (floats), converted to integers on submit
  savingsTargetAmount: z.number().positive().optional(),
  savingsTargetDate: accountInsertSchema.shape.savingsTargetDate
})
type CreateSavingAccountFormValues = z.infer<
  typeof createSavingAccountFormSchema
>

// Update Saving Account Form Schema
const updateSavingAccountFormSchema = commonUpdateFieldsSchema.extend({
  // Form accepts display amounts (floats), converted to integers on submit
  savingsTargetAmount: z.number().positive().optional(),
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
  // Form accepts display amounts (floats), converted to integers on submit
  debtInitialAmount: z.number().positive().optional(),
  debtIsOwedToMe: z.boolean().optional(), // Local UI field, not saved to DB
  debtDueDate: accountInsertSchema.shape.debtDueDate
})
type CreateDebtAccountFormValues = z.infer<typeof createDebtAccountFormSchema>

// Update Debt Account Form Schema
// Note: debtIsOwedToMe is a local UI field used to control balance sign,
// it is NOT saved to the database
const updateDebtAccountFormSchema = commonUpdateFieldsSchema.extend({
  // Form accepts display amounts (floats), converted to integers on submit
  debtInitialAmount: z.number().positive().optional(),
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

/**
 * Type guard to distinguish create vs update form data
 * CreateAccountData has required currencyId, UpdateAccountData does not
 */
export function isCreateAccountData(
  data: AccountFormData
): data is CreateAccountData {
  return 'currencyId' in data && typeof data.currencyId === 'string'
}

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
