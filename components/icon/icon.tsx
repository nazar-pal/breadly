import type { LucideIcon, LucideProps } from 'lucide-react-native'
import { icons } from 'lucide-react-native'
import React from 'react'
import { iconWithClassName } from './iconWithClassName'

export type IconName = keyof typeof icons

interface Props extends LucideProps {
  name: IconName
}

export function Icon({ name, ...rest }: Props) {
  // eslint-disable-next-line
  const LucideIcon = icons[name] as LucideIcon

  iconWithClassName(LucideIcon)

  return <LucideIcon {...rest} />
}
