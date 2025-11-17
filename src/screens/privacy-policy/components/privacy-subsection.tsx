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
    <View className="rounded-2xl border border-border/40 bg-muted/10 p-4">
      <Text
        variant="h3"
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        {title}
      </Text>
      <FormattedText content={content} className="mt-2 text-muted-foreground" />
    </View>
  )
}
