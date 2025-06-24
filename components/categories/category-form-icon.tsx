import {
  AlignLeft,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Banknote,
  Briefcase,
  Building,
  Bus,
  Calendar,
  Camera,
  ChartBar,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CirclePlus,
  Coffee,
  CreditCard,
  DollarSign,
  Edit2,
  Film,
  Heart,
  Home,
  List,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Mic,
  Moon,
  MoonStar,
  Pencil,
  PiggyBank,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Shirt,
  Sun,
  Tag,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  UtensilsCrossed,
  Wallet,
  X
} from '@/lib/icons'
import React from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'
import { useCategoryType } from './lib/use-category-type'

// Get device dimensions
const { width: screenWidth } = Dimensions.get('window')

// Calculate icon size for 7 icons per row
// Account for container padding (48px = 24px * 2) and gaps between icons (6 gaps * 8px)
const CONTAINER_PADDING = 48
const GAPS_TOTAL = 6 * 8 // 6 gaps of 8px each
const AVAILABLE_WIDTH = screenWidth - CONTAINER_PADDING - GAPS_TOTAL
const ICON_SIZE = Math.floor(AVAILABLE_WIDTH / 7)
const ICON_BORDER_RADIUS = Math.max(8, ICON_SIZE * 0.15) // Responsive border radius

// Income icons (21 icons) - Sources of earning money
export const incomeIcons = {
  DollarSign, // General income/salary
  PiggyBank, // Savings interest/investment returns
  Briefcase, // Employment/professional income
  Building, // Business/property income
  TrendingUp, // Investment gains/growth income
  Home, // Rental income
  Heart, // Passion project/side hustle income
  Camera, // Photography income
  Film, // Video/content creation income
  Mic, // Podcasting/audio income
  Upload, // Digital sales/uploads income
  Mail, // Freelance/contract income notifications
  Calendar, // Scheduled payments/recurring income
  Users, // Partnership/collaboration income
  User, // Personal services income
  RefreshCw, // Recurring subscriptions income
  Target, // Income goals/bonuses achieved
  ChartBar, // Income performance/analytics
  Plus, // Additional income streams
  Shield, // Insurance payouts/benefits
  Banknote // Cash tips/payments
} as const

// Expense icons (42 icons) - Things you spend money on
export const expenseIcons = {
  // Food & Dining (6 icons)
  Coffee,
  UtensilsCrossed,
  Receipt,
  Tag,
  Check, // Food delivery confirmations
  Sun, // Outdoor dining

  // Transportation & Travel (6 icons)
  Bus,
  Lock,
  Settings,
  ArrowRight, // Travel direction
  ArrowUp, // Travel progress
  ArrowDown, // Travel costs

  // Shopping & Clothing (6 icons)
  Shirt,
  CreditCard,
  CirclePlus,
  Moon,
  MoonStar, // Premium shopping
  Trash2, // Returns/exchanges

  // Technology & Communication (6 icons)
  Edit2,
  MessageSquare,
  Pencil,
  Save,
  LogIn, // Software subscriptions
  LogOut, // Service cancellations

  // Bills & Financial Services (6 icons)
  List,
  ChartLine,
  Wallet,
  TrendingDown, // Expense reduction
  X, // Bill cancellation
  ChevronDown, // Bill breakdown

  // Health & Personal Care (6 icons)
  UserPlus, // Healthcare appointments
  ChevronUp, // Health improvements
  ChevronLeft, // Medical history
  ChevronRight, // Medical progress
  AlignLeft, // Medical documents
  Shield // Health insurance

  // Home & Entertainment (6 icons)
  // Using remaining icons for home/entertainment expenses
} as const

export type ExpenseIconName = keyof typeof expenseIcons
export type IncomeIconName = keyof typeof incomeIcons
export type IconName = ExpenseIconName | IncomeIconName

interface CategoryFormIconProps {
  selectedIcon: IconName
  onIconSelect: (iconName: IconName) => void
}

export function CategoryFormIcon({
  selectedIcon,
  onIconSelect
}: CategoryFormIconProps) {
  const categoryType = useCategoryType()

  const handleIconSelect = (iconName: IconName) => {
    onIconSelect(iconName)
  }

  const getIconBackgroundColor = (isSelected: boolean) => {
    if (isSelected) {
      return categoryType === 'income'
        ? 'rgba(16, 185, 129, 0.2)' // Green for income
        : 'rgba(99, 102, 241, 0.2)' // Purple for expense
    }
    return '#F8FAFC' // Neutral background
  }

  const getIconBorderColor = (isSelected: boolean) => {
    if (isSelected) {
      return categoryType === 'income' ? '#10B981' : '#6366F1'
    }
    return '#E2E8F0'
  }

  const getIconColor = (isSelected: boolean) => {
    if (isSelected) {
      return categoryType === 'income' ? '#10B981' : '#6366F1'
    }
    return '#64748B'
  }

  const renderIconButton = (iconName: IconName, IconComponent: any) => {
    const isSelected = selectedIcon === iconName
    const iconDisplaySize = Math.max(16, ICON_SIZE * 0.5) // Icon size is 50% of container

    return (
      <Pressable
        key={iconName}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: ICON_BORDER_RADIUS,
          borderWidth: 2,
          backgroundColor: getIconBackgroundColor(isSelected),
          borderColor: getIconBorderColor(isSelected)
        }}
        onPress={() => handleIconSelect(iconName)}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <IconComponent
          size={iconDisplaySize}
          color={getIconColor(isSelected)}
        />
      </Pressable>
    )
  }

  const renderIncomeIcons = () => {
    const iconNames = Object.keys(incomeIcons) as IncomeIconName[]

    return (
      <View>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-foreground">
            Choose Icon
          </Text>
          <Text className="text-xs font-medium text-muted-foreground">
            Selected: {selectedIcon}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'flex-start'
          }}
        >
          {iconNames.map(iconName => {
            const IconComponent = incomeIcons[iconName]
            return renderIconButton(iconName, IconComponent)
          })}
        </View>
      </View>
    )
  }

  const renderExpenseIcons = () => {
    const iconNames = Object.keys(expenseIcons) as ExpenseIconName[]

    return (
      <View>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-foreground">
            Choose Icon
          </Text>
          <Text className="text-xs font-medium text-muted-foreground">
            Selected: {selectedIcon}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'flex-start'
          }}
        >
          {iconNames.map(iconName => {
            const IconComponent = expenseIcons[iconName]
            return renderIconButton(iconName, IconComponent)
          })}
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {categoryType === 'income' ? renderIncomeIcons() : renderExpenseIcons()}
    </View>
  )
}
