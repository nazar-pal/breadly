import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Pressable, View } from 'react-native'
import {
  AccountDetails,
  deleteAccount,
  updateAccount,
  useCheckAccountDependencies
} from '../../../data'
import { useAccountModalActions } from '../../../store'

interface Props {
  account: AccountDetails
}

export function DetailsHeaderActions({ account }: Props) {
  const router = useRouter()
  const { userId } = useUserSession()

  const { openAccountModalForEdit } = useAccountModalActions()

  const { canDelete, hasTransactions } = useCheckAccountDependencies({
    userId,
    accountId: account.id
  })

  const handleDeleteAccount = async () => {
    const [error] = await deleteAccount({
      id: account.id,
      userId
    })
    if (error) {
      Alert.alert(
        'Cannot delete account',
        'This account has transactions and cannot be deleted. Please archive it instead.'
      )
      return
    }
    router.back()
  }

  const onDelete = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete the account "${account.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleteAccount
        }
      ]
    )
  }
  const onArchive = () => {
    const message = hasTransactions
      ? `"${account.name}" has transactions and cannot be deleted. It will be archived instead. You can unarchive it later.`
      : `Are you sure you want to archive "${account.name}"? It will be hidden but can be restored later.`

    Alert.alert('Archive Account', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        style: 'default',
        onPress: async () => {
          const [error] = await updateAccount({
            id: account.id,
            userId,
            data: { isArchived: true }
          })
          if (error) {
            Alert.alert('Error', 'Failed to archive account. Please try again.')
            return
          }
        }
      }
    ])
  }

  const onUnarchive = () => {
    Alert.alert(
      'Unarchive Account',
      `Are you sure you want to restore "${account.name}"? It will become visible and usable again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unarchive',
          style: 'default',
          onPress: async () => {
            const [error] = await updateAccount({
              id: account.id,
              userId,
              data: { isArchived: false }
            })
            if (error) {
              Alert.alert(
                'Error',
                'Failed to unarchive account. Please try again.'
              )
              return
            }
          }
        }
      ]
    )
  }
  return (
    <View className="flex-row gap-2">
      <Pressable
        onPress={() => openAccountModalForEdit(account)}
        className={cn(
          'h-9 w-9 items-center justify-center rounded-full',
          'bg-background/80',
          'active:bg-muted',
          'border border-border/30'
        )}
      >
        <Icon name="Pencil" size={16} className="text-muted-foreground" />
      </Pressable>
      {account.isArchived ? (
        <Pressable
          onPress={onUnarchive}
          className={cn(
            'h-9 w-9 items-center justify-center rounded-full',
            'bg-emerald-100/70',
            'active:bg-emerald-100',
            'border border-emerald-300'
          )}
        >
          <Icon name="RefreshCw" size={16} className="text-emerald-700" />
        </Pressable>
      ) : canDelete ? (
        <Pressable
          onPress={onDelete}
          className={cn(
            'h-9 w-9 items-center justify-center rounded-full',
            'bg-destructive/10',
            'active:bg-destructive/20',
            'border border-destructive/30'
          )}
        >
          <Icon name="Trash" size={16} className="text-destructive" />
        </Pressable>
      ) : (
        <Pressable
          onPress={onArchive}
          className={cn(
            'h-9 w-9 items-center justify-center rounded-full',
            'bg-orange-100/70',
            'active:bg-orange-100',
            'border border-orange-300'
          )}
        >
          <Icon name="Archive" size={16} className="text-orange-700" />
        </Pressable>
      )}
    </View>
  )
}
