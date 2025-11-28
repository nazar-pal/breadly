import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { View } from 'react-native'

type JsonViewerCardProps = {
  offerings: unknown
  customerInfo: unknown
}

export function JsonViewerCard({
  offerings,
  customerInfo
}: JsonViewerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <View className="flex-row items-center gap-2">
          <Icon name="Braces" size={14} className="text-primary" />
          <CardTitle className="text-sm">Raw Data</CardTitle>
        </View>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="multiple" className="border-border rounded-lg border">
          <JsonSection title="Offerings" data={offerings} />
          <JsonSection title="CustomerInfo" data={customerInfo} isLast />
        </Accordion>
      </CardContent>
    </Card>
  )
}

function JsonSection({
  title,
  data,
  isLast
}: {
  title: string
  data: unknown
  isLast?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const formatted = (() => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  })()

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }

  return (
    <AccordionItem
      value={title}
      className={!isLast ? 'border-border border-b' : ''}
    >
      <AccordionTrigger className="items-center px-3 py-2">
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-foreground text-xs font-medium">{title}</Text>
          <Text className="text-muted-foreground text-[10px]">
            {formatted.length} chars
          </Text>
        </View>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <View className="flex-row justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="mb-1 h-6 gap-1 px-2"
            onPress={handleCopy}
          >
            <Icon
              name={copied ? 'Check' : 'Copy'}
              size={10}
              className={copied ? 'text-green-600' : 'text-muted-foreground'}
            />
            <Text
              className={`text-[10px] ${copied ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Button>
        </View>
        <View className="bg-muted/50 rounded-md p-2">
          <Text
            selectable
            className="text-foreground font-mono text-[10px] leading-4"
          >
            {formatted}
          </Text>
        </View>
      </AccordionContent>
    </AccordionItem>
  )
}
