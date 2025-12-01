import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { View } from 'react-native'
import type { StorageItem } from '../lib'

type StorageItemCardProps = {
  item: StorageItem
  onDelete: (key: string) => void
  onEdit: (item: StorageItem) => void
}

export function StorageItemCard({
  item,
  onDelete,
  onEdit
}: StorageItemCardProps) {
  return (
    <AccordionItem
      value={item.key}
      className="border-border bg-card overflow-hidden rounded-lg border"
    >
      <AccordionTrigger className="items-center px-4 py-3">
        {/* Left side: Icon and Key */}
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Icon
            name={item.isJson ? 'Braces' : 'Type'}
            size={14}
            className="text-muted-foreground shrink-0"
          />
          <Text
            className="text-foreground flex-1 font-mono text-sm font-medium"
            numberOfLines={1}
          >
            {item.key}
          </Text>
        </View>

        {/* Right side: Action Buttons (before the chevron) */}
        <View className="flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onPress={() => onEdit(item)}
          >
            <Icon name="Pencil" size={14} className="text-muted-foreground" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon name="Trash2" size={14} className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{item.key}&quot;? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction onPress={() => onDelete(item.key)}>
                  <Text>Delete</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </AccordionTrigger>

      <AccordionContent className="border-border bg-muted/30 border-t px-4">
        <ViewMode item={item} />
      </AccordionContent>
    </AccordionItem>
  )
}

function ViewMode({ item }: { item: StorageItem }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(item.value ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail - clipboard may not be available
    }
  }

  return (
    <View className="gap-3 py-2">
      {/* Key (full, selectable) */}
      <View>
        <Text className="text-muted-foreground text-xs font-medium">Key</Text>
        <Text className="text-foreground mt-1 font-mono text-sm" selectable>
          {item.key}
        </Text>
      </View>

      {/* Value */}
      <View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground text-xs font-medium">
              {item.isJson ? 'JSON' : 'String'} Value
            </Text>
            {item.isJson && (
              <View className="bg-primary/10 rounded px-1.5 py-0.5">
                <Text className="text-primary text-[10px] font-medium">
                  JSON
                </Text>
              </View>
            )}
          </View>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2"
            onPress={handleCopy}
          >
            <Icon
              name={copied ? 'Check' : 'Copy'}
              size={12}
              className={copied ? 'text-green-600' : 'text-muted-foreground'}
            />
            <Text
              className={`text-xs ${copied ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Button>
        </View>
        <View className="bg-background mt-1 rounded-md p-3">
          <Text
            className="text-foreground font-mono text-xs leading-5"
            selectable
          >
            {item.formattedValue}
          </Text>
        </View>
      </View>
    </View>
  )
}
