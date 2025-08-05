import { usePathname } from 'expo-router'

export function useCategoryType() {
  const pathname = usePathname()
  return pathname.includes('/incomes') || pathname.includes('/income')
    ? 'income'
    : 'expense'
}
