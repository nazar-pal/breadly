import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useEffect, useState } from 'react'
import { TextInput, View } from 'react-native'
import { hasStorageKey } from '../lib/storage-utils'

type StorageItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (key: string, value: string) => void
  /** If provided, we're in edit mode */
  editingItem?: { key: string; value: string | undefined } | null
}

export function StorageItemDialog({
  open,
  onOpenChange,
  onSave,
  editingItem
}: StorageItemDialogProps) {
  const isEditMode = !!editingItem
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog opens/closes or editingItem changes
  useEffect(() => {
    if (open) {
      if (editingItem) {
        setKey(editingItem.key)
        setValue(editingItem.value ?? '')
      } else {
        setKey('')
        setValue('')
      }
      setError(null)
    }
  }, [open, editingItem])

  const handleSave = () => {
    const trimmedKey = key.trim()

    if (!trimmedKey) {
      setError('Key is required')
      return
    }

    // Only check for duplicate key when adding new item
    if (!isEditMode && hasStorageKey(trimmedKey)) {
      setError('Key already exists')
      return
    }

    onSave(trimmedKey, value)
    onOpenChange(false)
  }

  const handleKeyChange = (text: string) => {
    setKey(text)
    if (error) setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Modify the value for this storage item.'
              : 'Add a new key-value pair to local storage.'}
          </DialogDescription>
        </DialogHeader>

        <View className="gap-4 px-6">
          <View className="gap-2">
            <Text className="text-foreground text-sm font-medium">Key</Text>
            {isEditMode ? (
              <Text className="text-muted-foreground font-mono text-sm">
                {key}
              </Text>
            ) : (
              <Input
                value={key}
                onChangeText={handleKeyChange}
                placeholder="Enter key name..."
                autoFocus
              />
            )}
            {error && <Text className="text-destructive text-xs">{error}</Text>}
          </View>

          <View className="gap-2">
            <Text className="text-foreground text-sm font-medium">Value</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="Enter value (can be JSON)..."
              multiline
              className="border-input bg-background text-foreground max-h-[150px] min-h-[100px] rounded-md border p-3 font-mono text-sm"
              textAlignVertical="top"
              autoFocus={isEditMode}
            />
            <Text className="text-muted-foreground text-xs">
              Tip: You can enter JSON and it will be formatted automatically.
            </Text>
          </View>
        </View>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={handleSave}>
            <Text>{isEditMode ? 'Save' : 'Add Item'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
