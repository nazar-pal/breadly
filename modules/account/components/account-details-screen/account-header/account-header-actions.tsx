import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Pressable, View } from 'react-native'
import { AccountDetails, deleteAccount } from '../../../data'
import { useAccountModalActions } from '../../../store'

interface Props {
  account: AccountDetails
}

export function DetailsHeaderActions({ account }: Props) {
  const router = useRouter()
  const { userId } = useUserSession()

  const { openAccountModalForEdit } = useAccountModalActions()

  const handleDeleteAccount = async () => {
    await deleteAccount({
      id: account.id,
      userId
    })
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
    </View>
  )
}
