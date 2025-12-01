// Note: Default seed icons are stored as strings; runtime resolves icons safely
import { type IconName } from '@/components/ui/lucide-icon-by-name'
import {
  CategoryType,
  type AccountInsertSQLite,
  type CategoryInsertSQLite
} from '@/data/client/db-schema'
import { env } from '@/env'
import { randomUUID } from 'expo-crypto'

// Default categories shown to first-time guests
type CategoryInsertSQLiteWithoutUserId = Omit<CategoryInsertSQLite, 'userId'>

type DefaultCategoryNode = {
  name: string
  icon: IconName
  description?: string
  subcategories?: DefaultCategoryNode[]
}

const DEFAULT_CATEGORY_TREE: {
  expense: DefaultCategoryNode[]
  income: DefaultCategoryNode[]
} = {
  expense: [
    {
      name: 'Food & Drinks',
      icon: 'Utensils',
      description:
        'Daily meals, groceries, and beverages (general, non-sweet-focused).',
      subcategories: [
        {
          name: 'Groceries',
          icon: 'ShoppingCart',
          description: 'Supermarket or market food purchases.'
        },
        {
          name: 'Restaurants',
          icon: 'Utensils',
          description: 'Meals at cafes, restaurants, and fast food.'
        },
        {
          name: 'Coffee & Tea',
          icon: 'Coffee',
          description: 'Coffee shops, tea, and small beverages.'
        },
        {
          name: 'Alcohol',
          icon: 'Beer',
          description: 'Beer, wine, and other alcoholic drinks.'
        }
      ]
    },
    {
      name: 'Sweets & Sugary',
      icon: 'Cake',
      description: 'Sweet foods and sugary drinks specifically tracked.',
      subcategories: [
        {
          name: 'Coffee & Tea',
          icon: 'Coffee',
          description: 'Sweetened coffee/tea and coffeehouse treats.'
        },
        {
          name: 'Restaurants',
          icon: 'Utensils',
          description: 'Desserts and sweet items ordered when dining out.'
        },
        {
          name: 'Groceries',
          icon: 'ShoppingCart',
          description:
            'Sweets, candy, chocolate, pastries, sweet drinks from stores.'
        }
      ]
    },
    {
      name: 'Shopping',
      icon: 'ShoppingBag',
      description: 'Personal shopping and purchases.',
      subcategories: [
        {
          name: 'Clothes',
          icon: 'Shirt',
          description: 'Clothing, shoes, and accessories.'
        },
        {
          name: 'Electronics',
          icon: 'Smartphone',
          description: 'Phones, laptops, and gadgets.'
        },
        {
          name: 'Gifts',
          icon: 'Gift',
          description: 'Purchases for gifts to others.'
        }
      ]
    },
    {
      name: 'Entertainment',
      icon: 'Film',
      description: 'Leisure and recreational spending.',
      subcategories: [
        {
          name: 'Movies & TV',
          icon: 'Clapperboard',
          description: 'Cinema, streaming, or series subscriptions.'
        },
        {
          name: 'Games',
          icon: 'Gamepad2',
          description: 'Video games, consoles, and apps.'
        },
        {
          name: 'Music',
          icon: 'Music',
          description: 'Concerts, music apps, and instruments.'
        },
        {
          name: 'Books',
          icon: 'BookOpen',
          description: 'Books, eBooks, and magazines.'
        }
      ]
    },
    {
      name: 'Housing',
      icon: 'House',
      description:
        'Costs related to your living space, with utilities combined.',
      subcategories: [
        { name: 'Rent', icon: 'Key', description: 'Monthly rental payments.' },
        {
          name: 'Utilities',
          icon: 'Plug',
          description:
            'Combined fee for electricity, water, gas, internet, etc.'
        },
        {
          name: 'Maintenance',
          icon: 'Wrench',
          description: 'Repairs, improvements, and upkeep.'
        }
      ]
    },
    {
      name: 'Transportation',
      icon: 'Bus',
      description: 'Non-car transport and local travel.',
      subcategories: [
        {
          name: 'Public Transport',
          icon: 'Bus',
          description: 'Bus, train, subway, or tram tickets.'
        },
        {
          name: 'Taxi & Ride-hailing',
          icon: 'Car',
          description: 'Taxi services or apps like Uber and Bolt.'
        }
      ]
    },
    {
      name: 'Health',
      icon: 'Stethoscope',
      description: 'Medical care, pharmacy, and fitness.',
      subcategories: [
        {
          name: 'Pharmacy',
          icon: 'Pill',
          description: 'Medicine and supplements.'
        },
        {
          name: 'Doctor & Clinic',
          icon: 'Stethoscope',
          description: 'Doctor visits and clinic services.'
        },
        {
          name: 'Dental',
          icon: 'Smile',
          description: 'Dentist visits and treatments.'
        },
        {
          name: 'Fitness',
          icon: 'Dumbbell',
          description: 'Gym memberships, sports, and exercise.'
        }
      ]
    },
    {
      name: 'Personal Care',
      icon: 'Sparkles',
      description: 'Self-care and grooming.',
      subcategories: [
        {
          name: 'Cosmetics',
          icon: 'Sparkles',
          description: 'Makeup and skincare products.'
        },
        {
          name: 'Hair & Barber',
          icon: 'Scissors',
          description: 'Haircuts, barber, or salon services.'
        },
        {
          name: 'Spa & Wellness',
          icon: 'Leaf',
          description: 'Spa, massages, and wellness treatments.'
        }
      ]
    },
    {
      name: 'Car',
      icon: 'Car',
      description: 'All expenses for owning and using your car.',
      subcategories: [
        {
          name: 'Fuel',
          icon: 'Fuel',
          description: 'Gasoline, diesel, or charging (if EV).'
        },
        {
          name: 'Maintenance & Repairs',
          icon: 'Wrench',
          description: 'Service, parts, tires, and regular maintenance.'
        },
        {
          name: 'Car Wash',
          icon: 'Sparkles',
          description: 'Washing, detailing, and cleaning supplies.'
        },
        {
          name: 'Parking & Tolls',
          icon: 'Ticket',
          description: 'Parking fees, toll roads, and related charges.'
        },
        {
          name: 'Purchase / Loan',
          icon: 'Banknote',
          description:
            'Car purchase payments, down payments, or loan installments.'
        }
      ]
    },
    {
      name: 'Education',
      icon: 'GraduationCap',
      description: 'Learning and courses.',
      subcategories: [
        {
          name: 'Courses',
          icon: 'GraduationCap',
          description: 'Online and offline courses.'
        },
        {
          name: 'Books & Materials',
          icon: 'BookOpen',
          description: 'Study books and materials.'
        }
      ]
    },
    {
      name: 'Pets',
      icon: 'Dog',
      description: 'Animal-related costs.',
      subcategories: [
        {
          name: 'Food & Supplies',
          icon: 'Bone',
          description: 'Pet food, toys, and essentials.'
        },
        {
          name: 'Vet',
          icon: 'Stethoscope',
          description: 'Veterinarian visits and medicine.'
        }
      ]
    },
    {
      name: 'Gifts & Charity',
      icon: 'Gift',
      description: 'Charitable giving and personal gifts.',
      subcategories: [
        {
          name: 'Gifts',
          icon: 'Gift',
          description: 'Personal gift spending.'
        },
        {
          name: 'Donations',
          icon: 'Heart',
          description: 'Charity donations and support.'
        }
      ]
    },
    {
      name: 'Travel',
      icon: 'Plane',
      description: 'Trips and vacations.',
      subcategories: [
        { name: 'Flights', icon: 'Plane', description: 'Airplane tickets.' },
        {
          name: 'Accommodation',
          icon: 'Bed',
          description: 'Hotels, hostels, and rentals.'
        },
        {
          name: 'Local Transport',
          icon: 'Bus',
          description: 'Transport during travel.'
        },
        {
          name: 'Tours & Activities',
          icon: 'Map',
          description: 'Excursions, guided tours, attractions.'
        }
      ]
    },
    {
      name: 'Insurance',
      icon: 'Shield',
      description: 'Insurance-related costs.',
      subcategories: [
        {
          name: 'Health',
          icon: 'Shield',
          description: 'Health insurance policies.'
        },
        {
          name: 'Auto',
          icon: 'Car',
          description: 'Car or vehicle insurance.'
        },
        {
          name: 'Home',
          icon: 'House',
          description: 'Home insurance policies.'
        },
        {
          name: 'Travel',
          icon: 'Plane',
          description: 'Travel insurance.'
        }
      ]
    },
    {
      name: 'Taxes',
      icon: 'Landmark',
      description: 'Payments to government.',
      subcategories: [
        {
          name: 'Income Tax',
          icon: 'Landmark',
          description: 'Personal or business income tax.'
        },
        {
          name: 'Other Taxes',
          icon: 'Receipt',
          description: 'Property or local taxes.'
        }
      ]
    },
    {
      name: 'Fees & Charges',
      icon: 'Receipt',
      description: 'Bank and service charges.',
      subcategories: [
        {
          name: 'Bank Fees',
          icon: 'Receipt',
          description: 'Service fees from banks.'
        },
        {
          name: 'Commissions',
          icon: 'Percent',
          description: 'Transaction and commission fees.'
        }
      ]
    },
    {
      name: 'Savings & Transfers (Out)',
      icon: 'ArrowUpRight',
      description: 'Money moved out to other accounts or savings.',
      subcategories: [
        {
          name: 'To Savings',
          icon: 'PiggyBank',
          description: 'Transfers to savings goals.'
        },
        {
          name: 'To Others',
          icon: 'ArrowUpRight',
          description: 'Money sent to other people.'
        }
      ]
    },
    {
      name: 'Miscellaneous',
      icon: 'MoveVertical',
      description: "Expenses that don't fit any category.",
      subcategories: [
        {
          name: 'Uncategorized',
          icon: 'MoveVertical',
          description: 'General uncategorized spending.'
        }
      ]
    }
  ],
  income: [
    {
      name: 'Salary',
      icon: 'Banknote',
      description: 'Primary income from employment.'
    },
    {
      name: 'Business',
      icon: 'Briefcase',
      description: 'Earnings from business activities.'
    },
    {
      name: 'Freelance',
      icon: 'Laptop',
      description: 'Payments from freelance projects.'
    },
    {
      name: 'Investments',
      icon: 'TrendingUp',
      description: 'Returns from stocks, crypto, or funds.'
    },
    {
      name: 'Dividends',
      icon: 'Coins',
      description: 'Payouts from company shares.'
    },
    {
      name: 'Interest',
      icon: 'Percent',
      description: 'Income from savings or deposits.'
    },
    { name: 'Gifts', icon: 'Gift', description: 'Money received as gifts.' },
    {
      name: 'Refunds',
      icon: 'Undo2',
      description: 'Money refunded from purchases.'
    },
    {
      name: 'Rental Income',
      icon: 'Building2',
      description: 'Income from renting properties.'
    },
    {
      name: 'Savings & Transfers (In)',
      icon: 'ArrowDownLeft',
      description: 'Money transferred from savings or others.'
    },
    {
      name: 'Other',
      icon: 'MoveVertical',
      description: 'Miscellaneous income sources.'
    }
  ]
}

function flattenCategories(
  nodes: DefaultCategoryNode[],
  type: CategoryType,
  parentId?: string
): CategoryInsertSQLiteWithoutUserId[] {
  const flat: CategoryInsertSQLiteWithoutUserId[] = []
  nodes.forEach((node, index) => {
    const id = randomUUID()
    const entry: CategoryInsertSQLiteWithoutUserId = {
      id,
      type,
      name: node.name,
      icon: node.icon,
      description: node.description,
      sortOrder: (index + 1) * env.EXPO_PUBLIC_SORT_ORDER_INCREMENT,
      ...(parentId ? { parentId } : {})
    }
    flat.push(entry)
    if (node.subcategories && node.subcategories.length > 0) {
      flat.push(...flattenCategories(node.subcategories, type, id))
    }
  })
  return flat
}

export const DEFAULT_CATEGORIES: readonly CategoryInsertSQLiteWithoutUserId[] =
  [
    ...flattenCategories(DEFAULT_CATEGORY_TREE.expense, 'expense'),
    ...flattenCategories(DEFAULT_CATEGORY_TREE.income, 'income')
  ] as const

// Default starter accounts
type AccountInsertSQLiteWithoutUserId = Omit<AccountInsertSQLite, 'userId'>

export const DEFAULT_ACCOUNTS: readonly AccountInsertSQLiteWithoutUserId[] = [
  {
    name: 'Cash',
    type: 'payment',
    currencyId: 'USD',
    description: 'Physical money kept in your wallet or at home.'
  },
  {
    name: 'Card',
    type: 'payment',
    currencyId: 'USD',
    description: 'Payments made with debit or credit cards.'
  },
  {
    name: 'Dream',
    type: 'saving',
    currencyId: 'USD',
    description: 'A savings account for a special goal or dream.'
  }
] as const
