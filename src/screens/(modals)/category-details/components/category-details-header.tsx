import { Icon } from '@/components/ui/icon-by-name'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { deleteCategory, setCategoryArchiveStatus } from '../data'

interface CategoryDetailsHeaderProps {
  categoryData: any
  userId: string
  canDelete: boolean
  hasTransactions: boolean
  hasSubcategories: boolean
  transactionCount: number
  subcategoryCount: number
  isDependencyCheckLoading: boolean
  onClose: () => void
}

export function CategoryDetailsHeader({
  categoryData,
  userId,
  canDelete,
  hasTransactions,
  hasSubcategories,
  transactionCount,
  subcategoryCount,
  isDependencyCheckLoading,
  onClose
}: CategoryDetailsHeaderProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingArchiveStatus, setIsUpdatingArchiveStatus] = useState(false)

  const handleEdit = () => {
    onClose()
    if (categoryData) {
      router.push(`/edit-categories/${categoryData.id}`)
    }
  }

  const handleDelete = () => {
    if (!categoryData) return

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${categoryData.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true)
            try {
              const [error] = await deleteCategory({
                id: categoryData.id,
                userId
              })

              if (error) {
                Alert.alert(
                  'Error',
                  'Failed to delete category. Please try again.'
                )
              } else {
                onClose()
              }
            } catch {
              Alert.alert(
                'Error',
                'Failed to delete category. Please try again.'
              )
            } finally {
              setIsDeleting(false)
            }
          }
        }
      ]
    )
  }

  const handleArchive = () => {
    if (!categoryData) return

    const dependencyMessage = []
    if (hasTransactions)
      dependencyMessage.push(
        `${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}`
      )
    if (hasSubcategories)
      dependencyMessage.push(
        `${subcategoryCount} subcategor${subcategoryCount !== 1 ? 'ies' : 'y'}`
      )

    const message =
      dependencyMessage.length > 0
        ? `"${categoryData.name}" has ${dependencyMessage.join(', ')} and will be archived instead of deleted. Archived categories are hidden but preserve your data.`
        : `Are you sure you want to archive "${categoryData.name}"? It will be hidden but can be restored later.`

    Alert.alert('Archive Category', message, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Archive',
        style: 'default',
        onPress: async () => {
          setIsUpdatingArchiveStatus(true)
          try {
            const [error] = await setCategoryArchiveStatus({
              id: categoryData.id,
              userId,
              isArchived: true
            })

            if (error) {
              Alert.alert(
                'Error',
                'Failed to archive category. Please try again.'
              )
            } else {
              onClose()
            }
          } catch {
            Alert.alert(
              'Error',
              'Failed to archive category. Please try again.'
            )
          } finally {
            setIsUpdatingArchiveStatus(false)
          }
        }
      }
    ])
  }

  const handleUnarchive = () => {
    if (!categoryData) return

    Alert.alert(
      'Unarchive Category',
      `Are you sure you want to restore "${categoryData.name}"? It will become visible and usable again.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Unarchive',
          style: 'default',
          onPress: async () => {
            setIsUpdatingArchiveStatus(true)
            try {
              const [error] = await setCategoryArchiveStatus({
                id: categoryData.id,
                userId,
                isArchived: false
              })

              if (error) {
                Alert.alert(
                  'Error',
                  'Failed to unarchive category. Please try again.'
                )
              } else {
                onClose()
              }
            } catch {
              Alert.alert(
                'Error',
                'Failed to unarchive category. Please try again.'
              )
            } finally {
              setIsUpdatingArchiveStatus(false)
            }
          }
        }
      ]
    )
  }

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="ml-auto flex-row gap-2">
        <Pressable
          onPress={handleEdit}
          className="border-border bg-card flex-row items-center gap-2 rounded-lg border px-3 py-2"
        >
          <Icon name="Pencil" size={16} className="text-primary" />
          <Text className="text-primary text-sm font-medium">Edit</Text>
        </Pressable>

        {!isDependencyCheckLoading && (
          <>
            {categoryData.isArchived ? (
              <Pressable
                onPress={handleUnarchive}
                disabled={isUpdatingArchiveStatus}
                className="flex-row items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2"
              >
                <Icon name="RefreshCw" size={16} className="text-green-600" />
                <Text className="text-sm font-medium text-green-600">
                  {isUpdatingArchiveStatus ? 'Unarchiving...' : 'Unarchive'}
                </Text>
              </Pressable>
            ) : (
              <>
                {canDelete ? (
                  <Pressable
                    onPress={handleDelete}
                    disabled={isDeleting}
                    className="flex-row items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2"
                  >
                    <Icon name="Trash2" size={16} className="text-red-600" />
                    <Text className="text-sm font-medium text-red-600">
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handleArchive}
                    disabled={isUpdatingArchiveStatus}
                    className="flex-row items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2"
                  >
                    <Icon
                      name="Archive"
                      size={16}
                      className="text-orange-600"
                    />
                    <Text className="text-sm font-medium text-orange-600">
                      {isUpdatingArchiveStatus ? 'Archiving...' : 'Archive'}
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </>
        )}
      </View>
    </View>
  )
}
