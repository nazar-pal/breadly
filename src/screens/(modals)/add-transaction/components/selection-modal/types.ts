import type { ReactNode } from 'react'

export interface SelectableRowProps {
  itemKey: string
  selected?: boolean
  disabled?: boolean
  onPress: () => void
  leftElement?: ReactNode
  title: ReactNode
  subtitle?: string
  rightElement?: ReactNode
}
