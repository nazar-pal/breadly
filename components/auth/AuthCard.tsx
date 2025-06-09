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
        <View className="bg-primary mb-6 h-20 w-20 items-center justify-center rounded-full">
          {icon}
        </View>
        <Text className="text-foreground mb-2 text-3xl font-bold">{title}</Text>
        <Text className="text-muted-foreground text-center text-base leading-6">
          {subtitle}
        </Text>
      </View>

      <Card>
        <CardContent className="p-5">{children}</CardContent>
      </Card>
    </React.Fragment>
  )
}
