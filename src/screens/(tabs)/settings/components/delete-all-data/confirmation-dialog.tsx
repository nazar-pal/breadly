import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <View className="mb-2 items-center">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <Icon
                name="TriangleAlert"
                size={28}
                className="text-red-600 dark:text-red-400"
              />
            </View>
          </View>
          <AlertDialogTitle className="text-center text-xl text-red-600 dark:text-red-400">
            Delete All Data?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action is{' '}
            <Text className="font-bold text-red-600 dark:text-red-400">
              permanent and irreversible
            </Text>
            . All your data will be permanently deleted, including:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <View className="my-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icon
                name="ArrowLeftRight"
                size={16}
                className="text-red-600 dark:text-red-400"
              />
              <Text className="text-sm text-red-700 dark:text-red-300">
                All transactions
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon
                name="Wallet"
                size={16}
                className="text-red-600 dark:text-red-400"
              />
              <Text className="text-sm text-red-700 dark:text-red-300">
                All accounts and balances
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon
                name="Folders"
                size={16}
                className="text-red-600 dark:text-red-400"
              />
              <Text className="text-sm text-red-700 dark:text-red-300">
                All categories
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon
                name="PiggyBank"
                size={16}
                className="text-red-600 dark:text-red-400"
              />
              <Text className="text-sm text-red-700 dark:text-red-300">
                All budgets
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon
                name="Settings"
                size={16}
                className="text-red-600 dark:text-red-400"
              />
              <Text className="text-sm text-red-700 dark:text-red-300">
                All preferences and settings
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-center text-sm text-muted-foreground">
            To confirm, type{' '}
            <Text className="font-mono font-bold text-foreground">
              {CONFIRMATION_PHRASE}
            </Text>{' '}
            below:
          </Text>
          <Input
            value={confirmationText}
            onChangeText={setConfirmationText}
            placeholder={CONFIRMATION_PHRASE}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            className="text-center font-mono"
            editable={!isDeleting}
          />
        </View>

        {error && (
          <View className="rounded-lg bg-red-100 p-3 dark:bg-red-950/50">
            <Text className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </Text>
          </View>
        )}

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel onPress={handleCancel} disabled={isDeleting}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            onPress={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <Text className="text-white">
              {isDeleting ? 'Deleting...' : 'Delete Everything'}
            </Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
