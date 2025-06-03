// Mock data for the app

// Mock expenses
export const mockExpenses = [
  {
    id: 'e-1',
    amount: 42.99,
    category: 'Groceries',
    date: '2025-03-01',
    description: 'Weekly groceries at Whole Foods',
    hasPhoto: true,
  },
  {
    id: 'e-2',
    amount: 12.5,
    category: 'Coffee',
    date: '2025-03-01',
    description: 'Morning coffee and pastry',
  },
  {
    id: 'e-3',
    amount: 65.0,
    category: 'Dining',
    date: '2025-02-28',
    description: 'Dinner with friends at Italian restaurant',
    hasVoice: true,
  },
  {
    id: 'e-4',
    amount: 9.99,
    category: 'Entertainment',
    date: '2025-02-27',
    description: 'Movie streaming subscription',
  },
  {
    id: 'e-5',
    amount: 34.5,
    category: 'Transportation',
    date: '2025-02-26',
    description: 'Uber ride to airport',
  },
  {
    id: 'e-6',
    amount: 120.0,
    category: 'Utilities',
    date: '2025-02-25',
    description: 'Electricity bill for February',
    hasPhoto: true,
  },
  {
    id: 'e-7',
    amount: 22.99,
    category: 'Shopping',
    date: '2025-02-24',
    description: 'New t-shirt',
  },
  {
    id: 'e-8',
    amount: 15.0,
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
    budget: 400.0,
    spent: 280.45,
  },
  {
    id: '2',
    name: 'Dining',
    budget: 300.0,
    spent: 215.65,
  },
  {
    id: '3',
    name: 'Coffee',
    budget: 50.0,
    spent: 62.5,
  },
  {
    id: '4',
    name: 'Entertainment',
    budget: 100.0,
    spent: 49.99,
  },
  {
    id: '5',
    name: 'Transportation',
    budget: 150.0,
    spent: 98.45,
  },
  {
    id: '6',
    name: 'Utilities',
    budget: 200.0,
    spent: 187.65,
  },
  {
    id: '7',
    name: 'Shopping',
    budget: 200.0,
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

// Mock income categories
export const mockIncomeCategories = [
  {
    id: '1',
    name: 'Salary',
    earned: 3500.0,
  },
  {
    id: '2',
    name: 'Freelance',
    earned: 800.0,
  },
  {
    id: '3',
    name: 'Investment',
    earned: 200.0,
  },
  {
    id: '4',
    name: 'Business',
    earned: 1200.0,
  },
  {
    id: '5',
    name: 'Rental',
    earned: 500.0,
  },
  {
    id: '6',
    name: 'Side Hustle',
    earned: 300.0,
  },
  {
    id: '7',
    name: 'Other',
    earned: 150.0,
  },
];

// Mock income entries
export const mockIncomes = [
  {
    id: 'i-1',
    amount: 3500.0,
    category: 'Salary',
    date: '2025-03-01',
    description: 'Monthly salary from company',
  },
  {
    id: 'i-2',
    amount: 400.0,
    category: 'Freelance',
    date: '2025-03-01',
    description: 'Website design project',
  },
  {
    id: 'i-3',
    amount: 150.0,
    category: 'Investment',
    date: '2025-02-28',
    description: 'Dividend payment',
  },
  {
    id: 'i-4',
    amount: 200.0,
    category: 'Side Hustle',
    date: '2025-02-27',
    description: 'Online course sales',
  },
  {
    id: 'i-5',
    amount: 500.0,
    category: 'Rental',
    date: '2025-02-25',
    description: 'Apartment rental income',
  },
  {
    id: 'i-6',
    amount: 1000.0,
    category: 'Business',
    date: '2025-02-24',
    description: 'Client payment',
  },
];