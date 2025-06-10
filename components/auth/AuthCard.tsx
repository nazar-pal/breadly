import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

interface AuthCardProps {
  icon: ReactNode
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ icon, title, subtitle, children }: AuthCardProps) {
  return (
    <React.Fragment>
      <View className="mb-8 items-center">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary">
          {icon}
        </View>
        <Text className="mb-2 text-3xl font-bold text-foreground">{title}</Text>
        <Text className="text-center text-base leading-6 text-muted-foreground">
          {subtitle}
        </Text>
      </View>

      <Card>
        <CardContent className="p-5">{children}</CardContent>
      </Card>
    </React.Fragment>
  )
}
