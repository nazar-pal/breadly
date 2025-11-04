import {
  createDeptAccountFormSchema,
  createPaymentAccountFormSchema,
  createSavingAccountFormSchema,
  updateDeptAccountFormSchema,
  updatePaymentAccountFormSchema,
  updateSavingAccountFormSchema
} from '../schema'

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
    create: createDeptAccountFormSchema,
    update: updateDeptAccountFormSchema
  }
} as const
