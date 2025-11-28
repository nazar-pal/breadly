import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import type { PrivacySubsection as PrivacySubsectionType } from '../lib/types'
import { FormattedText } from './formatted-text'

interface Props {
  subsection: PrivacySubsectionType
}

export function PrivacySubsection({ subsection }: Props) {
  const { title, content } = subsection

  return (
    <View className="border-border/40 bg-muted/10 rounded-2xl border p-4">
      <Text
        variant="h3"
        className="text-foreground text-lg font-semibold tracking-tight"
      >
        {title}
      </Text>
      <FormattedText content={content} className="text-muted-foreground mt-2" />
    </View>
  )
}
