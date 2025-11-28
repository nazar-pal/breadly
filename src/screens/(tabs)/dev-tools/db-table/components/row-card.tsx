import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

type RowCardProps = {
  row: Record<string, unknown>
  rowNumber: number
}

export function RowCard({ row, rowNumber }: RowCardProps) {
  const [expanded, setExpanded] = useState(false)
  const entries = Object.entries(row)

  return (
    <View className="border-border bg-card overflow-hidden rounded-lg border">
      {/* Row number header - tappable to expand/collapse */}
      <Pressable
        onPress={() => setExpanded(prev => !prev)}
        className="border-border bg-muted/50 flex-row items-center justify-between border-b px-3 py-1.5"
      >
        <Text className="text-muted-foreground font-mono text-xs">
          Row #{rowNumber}
        </Text>
        <Icon
          name={expanded ? 'ChevronUp' : 'ChevronDown'}
          size={14}
          className="text-muted-foreground"
        />
      </Pressable>

      {/* Fields */}
      <View className="p-2">
        {entries.map(([key, value], idx) => (
          <FieldRow
            key={key}
            fieldKey={key}
            value={value}
            isLast={idx === entries.length - 1}
            expanded={expanded}
          />
        ))}
      </View>
    </View>
  )
}

function FieldRow({
  fieldKey,
  value,
  isLast,
  expanded
}: {
  fieldKey: string
  value: unknown
  isLast: boolean
  expanded: boolean
}) {
  const [copied, setCopied] = useState(false)
  const { isJson, jsonValue, displayValue } = parseValue(value)
  const isNull = value === null || value === undefined

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(displayValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <View
      className={`px-1 py-1.5 ${!isLast ? 'border-border/50 border-b' : ''}`}
    >
      <View className="flex-row items-start">
        <Text
          className="text-muted-foreground w-1/3 shrink-0 text-xs"
          numberOfLines={expanded ? undefined : 1}
        >
          {fieldKey}
        </Text>
        <View className="min-w-0 flex-1 flex-row items-start gap-1">
          {!expanded || !isJson ? (
            <Text
              className={`min-w-0 flex-1 font-mono text-xs ${
                isNull ? 'text-muted-foreground italic' : 'text-foreground'
              }`}
              selectable
              numberOfLines={expanded ? undefined : 3}
            >
              {displayValue}
            </Text>
          ) : (
            <View className="min-w-0 flex-1">
              <JsonViewer value={jsonValue} />
            </View>
          )}
          {!isNull && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0"
              onPress={handleCopy}
            >
              <Icon
                name={copied ? 'Check' : 'Copy'}
                size={10}
                className={copied ? 'text-green-600' : 'text-muted-foreground'}
              />
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}

function parseValue(value: unknown): {
  isJson: boolean
  jsonValue: unknown
  displayValue: string
} {
  if (value === null)
    return { isJson: false, jsonValue: null, displayValue: 'null' }
  if (value === undefined)
    return { isJson: false, jsonValue: undefined, displayValue: 'undefined' }

  // If it's already an object, it's JSON
  if (typeof value === 'object') {
    return {
      isJson: true,
      jsonValue: value,
      displayValue: JSON.stringify(value, null, 2)
    }
  }

  // Try to parse string as JSON
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          isJson: true,
          jsonValue: parsed,
          displayValue: JSON.stringify(parsed, null, 2)
        }
      }
    } catch {
      // Not JSON, return as string
    }
  }

  return { isJson: false, jsonValue: value, displayValue: String(value) }
}

// JSON Viewer with syntax highlighting
function JsonViewer({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null) {
    return <Text className="font-mono text-xs text-orange-500">null</Text>
  }

  if (typeof value === 'boolean') {
    return (
      <Text className="font-mono text-xs text-purple-500">
        {value ? 'true' : 'false'}
      </Text>
    )
  }

  if (typeof value === 'number') {
    return <Text className="font-mono text-xs text-blue-500">{value}</Text>
  }

  if (typeof value === 'string') {
    return (
      <Text className="font-mono text-xs text-green-600" selectable>
        &quot;{value}&quot;
      </Text>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <Text className="text-foreground font-mono text-xs">[]</Text>
    }

    return (
      <View>
        <Text className="text-foreground font-mono text-xs">[</Text>
        {value.map((item, idx) => (
          <View key={idx} className="flex-row" style={{ paddingLeft: 12 }}>
            <JsonViewer value={item} depth={depth + 1} />
            {idx < value.length - 1 && (
              <Text className="text-foreground font-mono text-xs">,</Text>
            )}
          </View>
        ))}
        <Text className="text-foreground font-mono text-xs">]</Text>
      </View>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) {
      return <Text className="text-foreground font-mono text-xs">{'{}'}</Text>
    }

    return (
      <View>
        <Text className="text-foreground font-mono text-xs">{'{'}</Text>
        {entries.map(([key, val], idx) => (
          <View
            key={key}
            className="flex-row flex-wrap"
            style={{ paddingLeft: 12 }}
          >
            <Text className="text-primary font-mono text-xs">
              &quot;{key}&quot;
            </Text>
            <Text className="text-foreground font-mono text-xs">: </Text>
            <JsonViewer value={val} depth={depth + 1} />
            {idx < entries.length - 1 && (
              <Text className="text-foreground font-mono text-xs">,</Text>
            )}
          </View>
        ))}
        <Text className="text-foreground font-mono text-xs">{'}'}</Text>
      </View>
    )
  }

  return (
    <Text className="text-foreground font-mono text-xs">{String(value)}</Text>
  )
}
