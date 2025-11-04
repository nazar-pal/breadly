import {
  createDebtAccountFormSchema,
  createPaymentAccountFormSchema,
  createSavingAccountFormSchema,
  updateDebtAccountFormSchema,
  updatePaymentAccountFormSchema,
  updateSavingAccountFormSchema
} from './schema'

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
