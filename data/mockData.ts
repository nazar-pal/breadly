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
    amount: 12.50,
    category: 'Coffee',
    date: '2025-03-01',
    description: 'Morning coffee and pastry',
  },
  {
    id: '3',
    amount: 65.00,
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
    amount: 34.50,
    category: 'Transportation',
    date: '2025-02-26',
    description: 'Uber ride to airport',
  },
  {
    id: '6',
    amount: 120.00,
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
    amount: 15.00,
    category: 'Coffee',
    date: '2025-02-24',
    description: 'Coffee with colleague',
  },
];

// Mock categories
export const mockCategories = [
  {
    id: '1',
    name: 'Groceries',
    budget: 400.00,
    spent: 280.45,
  },
  {
    id: '2',
    name: 'Dining',
    budget: 300.00,
    spent: 215.65,
  },
  {
    id: '3',
    name: 'Coffee',
    budget: 50.00,
    spent: 62.50,
  },
  {
    id: '4',
    name: 'Entertainment',
    budget: 100.00,
    spent: 49.99,
  },
  {
    id: '5',
    name: 'Transportation',
    budget: 150.00,
    spent: 98.45,
  },
  {
    id: '6',
    name: 'Utilities',
    budget: 200.00,
    spent: 187.65,
  },
  {
    id: '7',
    name: 'Shopping',
    budget: 200.00,
    spent: 122.99,
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