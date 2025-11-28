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
import { Icon } from '@/components/ui/icon-by-name'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { deleteAllUserData } from '@/data/client/mutations/delete-all-user-data'
import { useUserSession } from '@/system/session-and-migration'
import * as Sentry from '@sentry/react-native'
import { useState } from 'react'
import { View } from 'react-native'

const CONFIRMATION_PHRASE = 'DELETE ALL MY DATA'

type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfirmationDialog({
  open,
  onOpenChange
}: ConfirmationDialogProps) {
  const { userId } = useUserSession()
  const [confirmationText, setConfirmationText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isConfirmed =
    confirmationText.trim().toUpperCase() === CONFIRMATION_PHRASE

  const handleDelete = async () => {
    if (!isConfirmed || isDeleting) return

    setIsDeleting(true)
    setError(null)

    const [err] = await deleteAllUserData(userId)

    if (err) {
      Sentry.captureException(err)
      setError(err.message || 'Failed to delete data. Please try again.')
      setIsDeleting(false)
      return
    }

    setIsDeleting(false)
    setConfirmationText('')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setConfirmationText('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="items-center">
          <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
            <Icon
              name="TriangleAlert"
              size={24}
              className="text-red-600 dark:text-red-400"
            />
          </View>
          <DialogTitle className="text-center text-red-600 dark:text-red-400">
            Delete All Data?
          </DialogTitle>
          <DialogDescription className="text-center">
            This will permanently delete all your data including transactions,
            accounts, categories, and budgets.
          </DialogDescription>
        </DialogHeader>

        <View className="gap-3 px-6">
          <View className="gap-1.5">
            <Text className="text-center text-sm text-muted-foreground">
              Type{' '}
              <Text className="font-mono font-semibold text-foreground">
                {CONFIRMATION_PHRASE}
              </Text>{' '}
              to confirm
            </Text>
            <Input
              value={confirmationText}
              onChangeText={setConfirmationText}
              placeholder={CONFIRMATION_PHRASE}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              className="rounded-xl border-red-200 bg-red-50 text-center font-mono text-sm dark:border-red-900/50 dark:bg-red-950/20"
              placeholderTextColorClassName="text-red-300 dark:text-red-700"
              editable={!isDeleting}
            />
          </View>

          {error && (
            <View className="rounded-lg bg-red-100 p-2 dark:bg-red-950/50">
              <Text className="text-center text-xs text-red-600 dark:text-red-400">
                {error}
              </Text>
            </View>
          )}
        </View>

        <DialogFooter className="gap-2">
          <DialogClose>
            <Button variant="outline" disabled={isDeleting} onPress={handleCancel}>
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button
            disabled={!isConfirmed || isDeleting}
            onPress={handleDelete}
            className="bg-red-600 active:bg-red-700"
          >
            <Text className="text-white">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
