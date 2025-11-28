import { Accordion } from '@/components/ui/accordion'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  EmptyState,
  HeaderCard,
  StorageItemCard,
  StorageItemDialog
} from './components'
import {
  clearAllStorage,
  deleteStorageItem,
  getStorageItems,
  setStorageItem,
  type StorageItem
} from './lib'

export default function LocalStoreScreen() {
  const [allItems, setAllItems] = useState(getStorageItems)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StorageItem | null>(null)

  const jsonCount = allItems.filter(i => i.isJson).length
  const isEmpty = allItems.length === 0

  const refresh = () => {
    setAllItems(getStorageItems())
  }

  const handleDelete = (key: string) => {
    deleteStorageItem(key)
    refresh()
  }

  const handleClearAll = () => {
    clearAllStorage()
    refresh()
  }

  const handleSave = (key: string, value: string) => {
    setStorageItem(key, value)
    refresh()
  }

  const handleOpenAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: StorageItem) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingItem(null)
    }
  }

  return (
    <View className="bg-background flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <HeaderCard
          totalItems={allItems.length}
          jsonCount={jsonCount}
          onRefresh={refresh}
          onClearAll={handleClearAll}
          onAddNew={handleOpenAdd}
        />

        {isEmpty && <EmptyState />}

        {!isEmpty && (
          <Accordion
            type="multiple"
            defaultValue={allItems.map(i => i.key)}
            className="gap-3"
          >
            {allItems.map(item => (
              <StorageItemCard
                key={item.key}
                item={item}
                onDelete={handleDelete}
                onEdit={handleOpenEdit}
              />
            ))}
          </Accordion>
        )}
      </ScrollView>

      <StorageItemDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSave={handleSave}
        editingItem={editingItem}
      />
    </View>
  )
}
