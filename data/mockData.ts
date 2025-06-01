// Mock data for the app

// Mock expenses
export const mockExpenses = [
  {
    id: '1',
    amount: 42.99,
    category: 'Groceries',
    date: '2025-03-01',
    description: 'Weekly groceries at Whole Foods',
    hasPhoto: true,
  },
  {
    id: '2',
    amount: 12.5,
    category: 'Coffee',
    date: '2025-03-01',
    description: 'Morning coffee and pastry',
  },
  {
    id: '3',
    amount: 65.0,
    category: 'Dining',
    date: '2025-02-28',
    description: 'Dinner with friends at Italian restaurant',
    hasVoice: true,
  },
  {
    id: '4',
    amount: 9.99,
    category: 'Entertainment',
    date: '2025-02-27',
    description: 'Movie streaming subscription',
  },
  {
    id: '5',
    amount: 34.5,
    category: 'Transportation',
    date: '2025-02-26',
    description: 'Uber ride to airport',
  },
  {
    id: '6',
    amount: 120.0,
    category: 'Utilities',
    date: '2025-02-25',
    description: 'Electricity bill for February',
    hasPhoto: true,
  },
  {
    id: '7',
    amount: 22.99,
    category: 'Shopping',
    date: '2025-02-24',
    description: 'New t-shirt',
  },
  {
    id: '8',
    amount: 15.0,
    category: 'Coffee',
    date: '2025-02-24',
    description: 'Coffee with colleague',
  },
];

// Mock income sources
export const mockIncomeSources = [
  {
    id: '1',
    name: 'Cash',
    description: 'Cash payments and withdrawals',
    balance: 1250.00,
    icon: 'banknote',
  },
  {
    id: '2',
    name: 'Credit Card',
    description: 'Main credit card account',
    balance: 3450.75,
    icon: 'credit-card',
  },
];

// Mock income transactions
export const mockIncomeTransactions = [
  {
    id: '1',
    amount: 2500.00,
    sourceId: '1',
    sourceName: 'Cash',
    date: '2025-03-01',
    description: 'Monthly salary',
  },
  {
    id: '2',
    amount: 500.00,
    sourceId: '2',
    sourceName: 'Credit Card',
    date: '2025-02-28',
    description: 'Freelance payment',
  },
  {
    id: '3',
    amount: 100.00,
    sourceId: '1',
    sourceName: 'Cash',
    date: '2025-02-27',
    description: 'Side project revenue',
  },
];

// Mock summary data
export const mockSummary = {
  today: {
    total: 55.49,
    count: 2,
    trend: {
      percentage: 12.5,
      isPositive: false,
    },
  },
  week: {
    total: 302.98,
    count: 8,
    trend: {
      percentage: 5.2,
      isPositive: true,
    },
  },
  month: {
    total: 1278.45,
    count: 32,
    trend: {
      percentage: 3.8,
      isPositive: false,
    },
  },
};