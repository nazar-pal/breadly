import { Text } from '@/components/ui/text'
import React from 'react'
import { Linking } from 'react-native'
import { SUPPORT_EMAIL } from '../lib/consts'
import { parseContent } from '../lib/utils'

type TextVariant = React.ComponentProps<typeof Text>['variant']

interface FormattedTextProps {
  content: string
  variant?: TextVariant
  className?: string
}

export function FormattedText({
  content,
  variant = 'p',
  className
}: FormattedTextProps) {
  if (!content.includes(SUPPORT_EMAIL))
    return (
      <Text variant={variant} className={className}>
        {content}
      </Text>
    )

  const segments = parseContent(content)

  return (
    <Text variant={variant} className={className}>
      {segments.map((segment, index) =>
        segment.type === 'email' ? (
          <Text
            key={`email-${index}`}
            className="text-primary underline"
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          >
            {segment.content}
          </Text>
        ) : (
          <Text key={`text-${index}`}>{segment.content}</Text>
        )
      )}
    </Text>
  )
}
