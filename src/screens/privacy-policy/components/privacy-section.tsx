import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import type { PrivacySection as PrivacySectionType } from '../lib/types'
import { FormattedText } from './formatted-text'
import { PrivacySubsection } from './privacy-subsection'

interface Props {
  section: PrivacySectionType
}

export function PrivacySection({ section }: Props) {
  const { id, title, content, subsections } = section

  return (
    <View className="border-border/60 bg-background/95 rounded-3xl border p-5 shadow-sm shadow-black/5">
      <Text
        variant="h2"
        className="text-foreground border-none pb-0 text-2xl font-semibold tracking-tight"
      >
        {title}
      </Text>

      {subsections?.length ? (
        <View className="mt-4 space-y-4">
          {subsections.map(subsection => (
            <PrivacySubsection
              key={`${id}-${subsection.title}`}
              subsection={subsection}
            />
          ))}
        </View>
      ) : content ? (
        <FormattedText
          content={content}
          className="text-muted-foreground mt-3"
        />
      ) : null}
    </View>
  )
}
