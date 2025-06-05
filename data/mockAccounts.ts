import type { Account } from '@/hooks/useAccountManagement'

export const mockAccounts: {
  payment: Account[]
  savings: Account[]
  debt: Account[]
} = {
  payment: [
    {
      id: '1',
      name: 'Main Checking',
      description: 'Primary bank account',
      balance: 5420.5,
      currency: 'USD',
      type: 'payment' as const
    },
    {
      id: '2',
      name: 'Credit Card',
      description: 'Personal credit card',
      balance: -1250.75,
      currency: 'USD',
      type: 'payment' as const
    }
  ],
  savings: [
    {
      id: '3',
      name: 'Emergency Fund',
      description: 'Emergency savings',
      balance: 10000,
      targetAmount: 15000,
      currency: 'USD',
      type: 'savings' as const
    },
    {
      id: '4',
      name: 'Vacation Fund',
      description: 'Saving for summer vacation',
      balance: 2500,
      targetAmount: 5000,
      currency: 'USD',
      type: 'savings' as const
    }
  ],
  debt: [
    {
      id: '5',
      name: 'Student Loan',
      description: 'Federal student loan',
      initialAmount: 25000,
      balance: 18500,
      dueDate: '2025-12-31',
      interestRate: 4.5,
      institution: 'Department of Education',
      currency: 'USD',
      type: 'debt' as const,
      debtType: 'owed' as const
    },
    {
      id: '6',
      name: 'Friend Loan',
      description: 'Money lent to John',
      initialAmount: 500,
      balance: 500,
      dueDate: '2024-04-01',
      currency: 'USD',
      type: 'debt' as const,
      debtType: 'owedTo' as const,
      person: 'John Smith'
    }
  ]
}
