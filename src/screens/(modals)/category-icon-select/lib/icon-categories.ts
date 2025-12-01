import { LucideIconName } from '@/components/ui/icon-by-name'

export type IconCategory = {
  id: string
  name: string
  icons: LucideIconName[]
}

/**
 * Comprehensive icon categories for expense categories
 * Organized by common expense types with 100+ icons
 */
export const expenseIconCategories: IconCategory[] = [
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icons: [
      'Coffee',
      'UtensilsCrossed',
      'Utensils',
      'ChefHat',
      'Wine',
      'Beer',
      'Cake',
      'Cookie',
      'Apple',
      'Banana',
      'Carrot',
      'Fish',
      'IceCreamBowl',
      'Milk',
      'Pizza',
      'Sandwich',
      'ShoppingBag',
      'ShoppingCart',
      'Store',
      'Receipt'
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icons: [
      'Car',
      'Bus',
      'TrainTrack',
      'Plane',
      'Bike',
      'Fuel',
      'Navigation',
      'MapPin',
      'Map',
      'CircleParking',
      'Route',
      'Ship',
      'Truck',
      'Zap'
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icons: [
      'ShoppingBag',
      'ShoppingCart',
      'Tag',
      'Tags',
      'Package',
      'Box',
      'Gift',
      'Shirt',
      'Watch',
      'Gem',
      'Diamond',
      'Crown',
      'Sparkles'
    ]
  },
  {
    id: 'bills-utilities',
    name: 'Bills & Utilities',
    icons: [
      'Zap',
      'Lightbulb',
      'Droplet',
      'Flame',
      'House',
      'Building',
      'Building2',
      'Wifi',
      'Phone',
      'Tv',
      'Radio',
      'Monitor',
      'Printer',
      'FileText',
      'Receipt',
      'CreditCard',
      'Wallet'
    ]
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    icons: [
      'Heart',
      'HeartPulse',
      'Activity',
      'Dumbbell',
      'Stethoscope',
      'Pill',
      'Cross',
      'Bandage',
      'Syringe',
      'Thermometer',
      'Smile',
      'Baby',
      'Scissors',
      'Sparkles'
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icons: [
      'Film',
      'Tv',
      'Music',
      'Headphones',
      'Gamepad2',
      'Dice1',
      'Dice6',
      'Palette',
      'Camera',
      'Video',
      'Mic',
      'Radio',
      'Book',
      'BookOpen',
      'Clapperboard',
      'Ticket',
      'PartyPopper'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icons: [
      'Book',
      'BookOpen',
      'GraduationCap',
      'Pencil',
      'Pen',
      'PenTool',
      'Brain',
      'Lamp',
      'Award',
      'Trophy'
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icons: [
      'Scissors',
      'Sparkles',
      'Heart',
      'Smile',
      'User',
      'Users',
      'Baby',
      'Shirt',
      'Watch',
      'Gem',
      'Crown',
      'Star'
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    icons: [
      'Plane',
      'TrainTrack',
      'Car',
      'Ship',
      'Map',
      'MapPin',
      'Compass',
      'Navigation',
      'Umbrella',
      'Sun',
      'Moon',
      'Camera'
    ]
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icons: [
      'House',
      'Building',
      'Building2',
      'Wrench',
      'Hammer',
      'Paintbrush',
      'Droplet',
      'Flower',
      'Flower2',
      'TreePine',
      'TreeDeciduous',
      'Leaf',
      'Sprout',
      'Lamp',
      'Bed',
      'Plug'
    ]
  },
  {
    id: 'pets',
    name: 'Pets',
    icons: ['Dog', 'Cat', 'Fish', 'Bird', 'Heart', 'Bone', 'PawPrint']
  },
  {
    id: 'insurance-taxes',
    name: 'Insurance & Taxes',
    icons: [
      'Shield',
      'ShieldCheck',
      'FileText',
      'File',
      'Folder',
      'Calculator',
      'Percent',
      'DollarSign',
      'Receipt',
      'Scale',
      'Gavel',
      'Briefcase'
    ]
  },
  {
    id: 'charity-donations',
    name: 'Charity & Donations',
    icons: [
      'Heart',
      'HeartHandshake',
      'HandHeart',
      'Gift',
      'Coins',
      'DollarSign',
      'Users',
      'Hand'
    ]
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icons: [
      'Repeat',
      'RefreshCw',
      'Calendar',
      'Clock',
      'CreditCard',
      'Smartphone',
      'Tv',
      'Music',
      'Film',
      'Gamepad2',
      'Book',
      'Newspaper'
    ]
  },
  {
    id: 'general',
    name: 'General',
    icons: [
      'Circle',
      'Square',
      'Triangle',
      'Star',
      'Heart',
      'Tag',
      'Flag',
      'Bell',
      'Settings',
      'MoveHorizontal',
      'MoveVertical',
      'X',
      'Check',
      'Plus',
      'Minus'
    ]
  }
]

/**
 * Comprehensive icon categories for income categories
 * Organized by common income sources with 100+ icons
 */
export const incomeIconCategories: IconCategory[] = [
  {
    id: 'employment',
    name: 'Employment',
    icons: [
      'Briefcase',
      'Building',
      'Building2',
      'User',
      'Users',
      'UserCheck',
      'UserPlus',
      'Award',
      'Trophy',
      'Medal',
      'Target',
      'TrendingUp',
      'ChartLine',
      'ChartBar'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    icons: [
      'Briefcase',
      'Building',
      'Building2',
      'Store',
      'ShoppingBag',
      'Package',
      'Box',
      'Truck',
      'TrendingUp',
      'ChartLine',
      'ChartBar',
      'DollarSign',
      'Coins',
      'Banknote',
      'Wallet'
    ]
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icons: [
      'Laptop',
      'Monitor',
      'Code',
      'PenTool',
      'Pencil',
      'Palette',
      'Camera',
      'Video',
      'Mic',
      'Headphones',
      'FileText',
      'File',
      'Folder',
      'Upload',
      'Download',
      'Send',
      'Mail'
    ]
  },
  {
    id: 'investments',
    name: 'Investments',
    icons: [
      'TrendingUp',
      'ChartLine',
      'ChartBar',
      'Activity',
      'ArrowUp',
      'ArrowUpRight',
      'DollarSign',
      'Coins',
      'Banknote',
      'PiggyBank',
      'Wallet',
      'CreditCard',
      'Landmark',
      'Building',
      'Building2',
      'Diamond',
      'Gem',
      'Star',
      'Target'
    ]
  },
  {
    id: 'rental',
    name: 'Rental Income',
    icons: [
      'House',
      'Building',
      'Building2',
      'Key',
      'MapPin',
      'Map',
      'DollarSign',
      'Coins',
      'Banknote',
      'Receipt',
      'Calendar',
      'Clock'
    ]
  },
  {
    id: 'dividends-interest',
    name: 'Dividends & Interest',
    icons: [
      'Percent',
      'TrendingUp',
      'ChartLine',
      'Coins',
      'DollarSign',
      'Banknote',
      'PiggyBank',
      'Wallet',
      'Landmark',
      'Building',
      'Building2',
      'ArrowUp',
      'ArrowUpRight',
      'Activity'
    ]
  },
  {
    id: 'gifts-refunds',
    name: 'Gifts & Refunds',
    icons: [
      'Gift',
      'Heart',
      'HandHeart',
      'HeartHandshake',
      'Undo2',
      'RotateCcw',
      'ArrowLeft',
      'ArrowDownLeft',
      'DollarSign',
      'Coins',
      'Banknote',
      'Wallet',
      'CreditCard'
    ]
  },
  {
    id: 'government-benefits',
    name: 'Government Benefits',
    icons: [
      'Shield',
      'ShieldCheck',
      'FileText',
      'File',
      'Folder',
      'Scale',
      'Gavel',
      'Building',
      'Building2',
      'Landmark',
      'Flag',
      'DollarSign',
      'Coins',
      'Banknote'
    ]
  },
  {
    id: 'other-income',
    name: 'Other Income',
    icons: [
      'Circle',
      'Square',
      'Triangle',
      'Star',
      'Heart',
      'Tag',
      'Flag',
      'Bell',
      'Settings',
      'MoveHorizontal',
      'MoveVertical',
      'Plus',
      'ArrowDown',
      'ArrowDownLeft',
      'ArrowDownRight'
    ]
  }
]

/**
 * Get all icons for a category type (expense or income)
 */
export function getAllIconsForCategoryType(
  categoryType: 'expense' | 'income'
): LucideIconName[] {
  const categories =
    categoryType === 'expense' ? expenseIconCategories : incomeIconCategories
  return categories.flatMap(category => category.icons)
}

/**
 * Get all categories for a category type
 */
export function getCategoriesForCategoryType(
  categoryType: 'expense' | 'income'
): IconCategory[] {
  return categoryType === 'expense'
    ? expenseIconCategories
    : incomeIconCategories
}
