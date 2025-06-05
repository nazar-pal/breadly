// Mock data for the app

// Mock expenses
export const mockExpenses = [
  {
    id: '1',
    amount: 42.99,
    category: 'Groceries',
    date: '2025-03-01',
    description: 'Weekly groceries at Whole Foods',
    hasPhoto: true
  },
  {
    id: '2',
    amount: 12.5,
    category: 'Coffee',
    date: '2025-03-01',
    description: 'Morning coffee and pastry'
  },
  {
    id: '3',
    amount: 65.0,
    category: 'Dining',
    date: '2025-02-28',
    description: 'Dinner with friends at Italian restaurant',
    hasVoice: true
  },
  {
    id: '4',
    amount: 9.99,
    category: 'Entertainment',
    date: '2025-02-27',
    description: 'Movie streaming subscription'
  },
  {
    id: '5',
    amount: 34.5,
    category: 'Transportation',
    date: '2025-02-26',
    description: 'Uber ride to airport'
  },
  {
    id: '6',
    amount: 120.0,
    category: 'Utilities',
    date: '2025-02-25',
    description: 'Electricity bill for February',
    hasPhoto: true
  },
  {
    id: '7',
    amount: 22.99,
    category: 'Shopping',
    date: '2025-02-24',
    description: 'New t-shirt'
  },
  {
    id: '8',
    amount: 15.0,
    category: 'Coffee',
    date: '2025-02-24',
    description: 'Coffee with colleague'
  }
]

// Mock categories
export const mockCategories = [
  {
    id: '1',
    name: 'Groceries',
    budget: 400.0,
    spent: 280.45
  },
  {
    id: '2',
    name: 'Dining',
    budget: 300.0,
    spent: 215.65
  },
  {
    id: '3',
    name: 'Coffee',
    budget: 50.0,
    spent: 62.5
  },
  {
    id: '4',
    name: 'Entertainment',
    budget: 100.0,
    spent: 49.99
  },
  {
    id: '5',
    name: 'Transportation',
    budget: 150.0,
    spent: 0
  },
  {
    id: '6',
    name: 'Utilities',
    budget: 200.0,
    spent: 187.65
  },
  {
    id: '7',
    name: 'Shopping',
    budget: 200.0,
    spent: 122.99
  }
]

// Mock summary data
export const mockSummary = {
  today: {
    total: 55.49,
    count: 2,
    trend: {
      percentage: 12.5,
      isPositive: false
    }
  },
  week: {
    total: 302.98,
    count: 8,
    trend: {
      percentage: 5.2,
      isPositive: true
    }
  },
  month: {
    total: 1278.45,
    count: 32,
    trend: {
      percentage: 3.8,
      isPositive: false
    }
  }
}

// Mock income categories
export const mockIncomeCategories = [
  {
    id: '1',
    name: 'Salary',
    earned: 3500.0
  },
  {
    id: '2',
    name: 'Freelance',
    earned: 800.0
  },
  {
    id: '3',
    name: 'Investment',
    earned: 200.0
  },
  {
    id: '4',
    name: 'Business',
    earned: 1200.0
  },
  {
    id: '5',
    name: 'Rental',
    earned: 500.0
  },
  {
    id: '6',
    name: 'Side Hustle',
    earned: 300.0
  },
  {
    id: '7',
    name: 'Other',
    earned: 150.0
  }
]

// Mock income entries
export const mockIncomes = [
  {
    id: '1',
    amount: 3500.0,
    category: 'Salary',
    date: '2025-03-01',
    description: 'Monthly salary from company'
  },
  {
    id: '2',
    amount: 400.0,
    category: 'Freelance',
    date: '2025-03-01',
    description: 'Website design project'
  },
  {
    id: '3',
    amount: 150.0,
    category: 'Investment',
    date: '2025-02-28',
    description: 'Dividend payment'
  },
  {
    id: '4',
    amount: 200.0,
    category: 'Side Hustle',
    date: '2025-02-27',
    description: 'Online course sales'
  },
  {
    id: '5',
    amount: 500.0,
    category: 'Rental',
    date: '2025-02-25',
    description: 'Apartment rental income'
  },
  {
    id: '6',
    amount: 1000.0,
    category: 'Business',
    date: '2025-02-24',
    description: 'Client payment'
  }
]

// Mock debt operations (paid debts and received debts)
export const mockDebtOperations = [
  {
    id: '1',
    amount: 250.0,
    category: 'Student Loan Payment',
    date: '2025-03-01',
    description: 'Monthly student loan payment',
    debtType: 'paid' as const, // debt payment made by user
    creditor: 'Department of Education'
  },
  {
    id: '2',
    amount: 150.0,
    category: 'Friend Repayment',
    date: '2025-02-28',
    description: 'John repaid loan amount',
    debtType: 'received' as const, // debt payment received by user
    debtor: 'John Smith'
  },
  {
    id: '3',
    amount: 500.0,
    category: 'Credit Card Payment',
    date: '2025-02-27',
    description: 'Credit card monthly payment',
    debtType: 'paid' as const,
    creditor: 'Chase Bank'
  },
  {
    id: '4',
    amount: 75.0,
    category: 'Personal Loan',
    date: '2025-02-26',
    description: 'Received repayment from Sarah',
    debtType: 'received' as const,
    debtor: 'Sarah Johnson'
  }
]

// Mock other transaction types
export const mockOtherTransactions = [
  {
    id: '1',
    amount: 25.0,
    category: 'Bank Transfer',
    date: '2025-03-01',
    description: 'Transfer fee for international wire',
    transactionType: 'fee' as const
  },
  {
    id: '2',
    amount: 100.0,
    category: 'Refund',
    date: '2025-02-28',
    description: 'Product return refund',
    transactionType: 'refund' as const
  },
  {
    id: '3',
    amount: 50.0,
    category: 'Currency Exchange',
    date: '2025-02-27',
    description: 'USD to EUR exchange',
    transactionType: 'exchange' as const
  }
]

// Mock account operations (operations tied to specific accounts)
export const mockAccountOperations = [
  // Main Checking Account (id: '1') operations
  {
    id: 'op-1',
    accountId: '1',
    amount: -42.99,
    category: 'Groceries',
    date: '2025-03-01',
    description: 'Weekly groceries at Whole Foods',
    type: 'expense' as const
  },
  {
    id: 'op-2',
    accountId: '1',
    amount: 3500.0,
    category: 'Salary',
    date: '2025-03-01',
    description: 'Monthly salary deposit',
    type: 'income' as const
  },
  {
    id: 'op-3',
    accountId: '1',
    amount: -120.0,
    category: 'Utilities',
    date: '2025-02-28',
    description: 'Electricity bill payment',
    type: 'expense' as const
  },

  // Credit Card Account (id: '2') operations
  {
    id: 'op-4',
    accountId: '2',
    amount: -65.0,
    category: 'Dining',
    date: '2025-03-01',
    description: 'Dinner with friends',
    type: 'expense' as const
  },
  {
    id: 'op-5',
    accountId: '2',
    amount: -22.99,
    category: 'Shopping',
    date: '2025-02-28',
    description: 'Online purchase',
    type: 'expense' as const
  },
  {
    id: 'op-6',
    accountId: '2',
    amount: 500.0,
    category: 'Payment',
    date: '2025-02-27',
    description: 'Credit card payment from checking',
    type: 'payment' as const
  },

  // Emergency Fund (id: '3') operations
  {
    id: 'op-7',
    accountId: '3',
    amount: 200.0,
    category: 'Transfer',
    date: '2025-02-26',
    description: 'Monthly savings transfer',
    type: 'transfer' as const
  },
  {
    id: 'op-8',
    accountId: '3',
    amount: 15.5,
    category: 'Interest',
    date: '2025-02-25',
    description: 'Monthly interest earned',
    type: 'income' as const
  },

  // Student Loan (id: '5') operations
  {
    id: 'op-9',
    accountId: '5',
    amount: -250.0,
    category: 'Loan Payment',
    date: '2025-03-01',
    description: 'Monthly loan payment',
    type: 'payment' as const
  },
  {
    id: 'op-10',
    accountId: '5',
    amount: -250.0,
    category: 'Loan Payment',
    date: '2025-02-01',
    description: 'Monthly loan payment',
    type: 'payment' as const
  }
]
