import React from 'react'

import { iconWithClassName } from '@/lib/icons/iconWithClassName'
import {
  Briefcase,
  Building,
  Bus,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  LucideIcon,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed
} from 'lucide-react-native'

// Map category names to icons for expenses
const categoryIcons: { [key: string]: LucideIcon } = {
  Coffee: Coffee,
  Dining: UtensilsCrossed,
  Entertainment: Film,
  Transportation: Bus,
  Health: Heart,
  Home: Home,
  Family: Users,
  Shopping: Shirt
}

// Map income category names to icons
const incomeCategoryIcons: { [key: string]: LucideIcon } = {
  Salary: Briefcase,
  Freelance: DollarSign,
  Investment: TrendingUp,
  Business: Building,
  Rental: Home,
  'Side Hustle': Target,
  Other: PiggyBank
}

export function CategoryIcon({
  name,
  type
}: {
  name: string
  type: 'expense' | 'income'
}) {
  const icons = type === 'expense' ? categoryIcons : incomeCategoryIcons
  const IconComponent = icons[name] || Home
  iconWithClassName(IconComponent)
  return (
    <IconComponent
      size={20}
      className={type === 'expense' ? 'text-expense' : 'text-income'}
    />
  )
}
