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
import { createCategory } from '@/data/client/mutations'
import { useUserSession } from '@/system/session-and-migration'
import React, { useState } from 'react'
import { View } from 'react-native'

interface AddSubcategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentCategoryId: string
  parentCategoryName: string
  categoryType: 'expense' | 'income'
  onSubcategoryCreated: (subcategoryId: string) => void
}

export function AddSubcategoryDialog({
  open,
  onOpenChange,
  parentCategoryId,
  parentCategoryName,
  categoryType,
  onSubcategoryCreated
}: AddSubcategoryDialogProps) {
  const { userId } = useUserSession()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Please enter a subcategory name')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const [err, result] = await createCategory({
      userId,
      data: {
        name: trimmedName,
        type: categoryType,
        parentId: parentCategoryId,
        icon: 'circle'
      }
    })

    setIsSubmitting(false)

    if (err || !result) {
      setError('Failed to create subcategory. Please try again.')
      return
    }

    // Reset form and close dialog
    setName('')
    onOpenChange(false)

    // Notify parent about the new subcategory
    onSubcategoryCreated(result.id)
  }

  const handleClose = () => {
    setName('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} onInteractOutside={handleClose}>
        <DialogHeader>
          <DialogTitle>Add Subcategory</DialogTitle>
          <DialogDescription>
            Create a new subcategory under &quot;{parentCategoryName}&quot;
          </DialogDescription>
        </DialogHeader>

        <View className="px-6">
          <Input
            value={name}
            onChangeText={text => {
              setName(text)
              setError(null)
            }}
            placeholder="Subcategory name"
            autoFocus
            autoCapitalize="sentences"
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          {error && (
            <Text className="text-destructive mt-2 text-sm">{error}</Text>
          )}
        </View>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline" onPress={handleClose}>
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting || !name.trim()}
          >
            <Text>{isSubmitting ? 'Creating...' : 'Create'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
