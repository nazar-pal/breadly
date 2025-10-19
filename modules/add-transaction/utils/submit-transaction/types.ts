export type CalculatorInputs = {
  amount: number
  comment?: string
  txDate?: Date
}

export type WorkflowMap = {
  transfer: { fromAccountId: string; toAccountId: string }
  'expense-income:account': {
    type: 'expense' | 'income'
    categoryId: string
    accountId: string
  }
  'expense-income:currency': {
    type: 'expense' | 'income'
    categoryId: string
    currencyCode: string
  }
}

export type SubmitWorkflow = {
  [K in keyof WorkflowMap]: { kind: K; args: WorkflowMap[K] }
}[keyof WorkflowMap]

export type Submitters = {
  [K in keyof WorkflowMap]: (
    userId: string,
    args: WorkflowMap[K],
    inputs: CalculatorInputs
  ) => Promise<void>
}
