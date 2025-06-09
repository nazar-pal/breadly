import { useCategoryContext } from '@/context/CategoryContext'
import {
  Briefcase,
  Building,
  Bus,
  Check,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed,
  X
} from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

// Available icons for both expense and income categories
const availableIcons = {
  Coffee,
  UtensilsCrossed,
  Film,
  Bus,
  Heart,
  Home,
  Users,
  Shirt,
  Briefcase,
  DollarSign,
  TrendingUp,
  Building,
  Target,
  PiggyBank
}

const iconNames = Object.keys(availableIcons) as (keyof typeof availableIcons)[]

export default function CategoryEditModal() {
  const insets = useSafeAreaInsets()
  const {
    editModalVisible,
    categoryToEdit,
    currentType,
    handleSaveCategory,
    handleCloseEditModal
  } = useCategoryContext()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof availableIcons>('Home')

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name)
      setDescription(categoryToEdit.description || '')
      // Try to match the category name to an icon, fallback to Home
      const matchedIcon = iconNames.find(
        icon =>
          icon.toLowerCase() === categoryToEdit.name.toLowerCase() ||
          categoryToEdit.name.toLowerCase().includes(icon.toLowerCase())
      )
      setSelectedIcon(matchedIcon || 'Home')
    } else {
      // Reset form when no category
      setName('')
      setDescription('')
      setSelectedIcon('Home')
    }
  }, [categoryToEdit])

  const handleSave = () => {
    if (!categoryToEdit || !name.trim()) {
      return
    }

    handleSaveCategory({
      id: categoryToEdit.id,
      name: name.trim(),
      description: description.trim(),
      iconName: selectedIcon
    })
  }

  const getIconBackgroundColor = () => {
    if (currentType === 'income') {
      return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
    }
    return '#F1F5F9' // colors.iconBackground.neutral
  }

  if (!categoryToEdit) return null

  return (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseEditModal}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          onPress={handleCloseEditModal}
        />
        <View
          className="rounded-t-3xl bg-old-background pt-2"
          style={{
            paddingBottom: insets.bottom + 16,
            maxHeight: SCREEN_HEIGHT * 0.8
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-old-border px-5 py-4">
            <Text className="text-xl font-semibold text-old-text">
              Edit {currentType === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <Pressable onPress={handleCloseEditModal} className="p-1">
              <X size={24} color="#1A202C" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {/* Category Name */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-old-text">
                Category Name
              </Text>
              <TextInput
                className="min-h-[48px] rounded-2xl border border-old-border bg-old-card px-4 py-3 text-base text-old-text"
                value={name}
                onChangeText={setName}
                placeholder="Enter category name"
                placeholderTextColor="#4A5568"
                autoFocus
              />
            </View>

            {/* Category Description */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-old-text">
                Description (Optional)
              </Text>
              <TextInput
                className="h-[100px] rounded-2xl border border-old-border bg-old-card px-4 py-3 text-base text-old-text"
                style={{ paddingTop: 12 }}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description for this category"
                placeholderTextColor="#4A5568"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Icon Selection */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-old-text">
                Choose Icon
              </Text>
              <View className="flex-row flex-wrap gap-3 pt-2">
                {iconNames.map(iconName => {
                  const IconComponent = availableIcons[iconName]
                  const isSelected = selectedIcon === iconName

                  return (
                    <Pressable
                      key={iconName}
                      className="h-14 w-14 items-center justify-center rounded-2xl border-2"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
                          : getIconBackgroundColor(),
                        borderColor: isSelected ? '#6366F1' : 'transparent' // colors.primary
                      }}
                      onPress={() => setSelectedIcon(iconName)}
                    >
                      <IconComponent
                        size={24}
                        color={isSelected ? '#6366F1' : '#1A202C'} // colors.primary : colors.text
                      />
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 border-t border-old-border-light px-5 pb-2 pt-4">
            <Pressable
              className="min-h-[48px] flex-[0.4] flex-row items-center justify-center gap-2 rounded-2xl border border-old-button-secondary-border bg-old-button-secondary-bg py-3"
              onPress={handleCloseEditModal}
            >
              <Text className="text-base font-semibold text-old-button-secondary-text">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              className="min-h-[48px] flex-[0.6] flex-row items-center justify-center gap-2 rounded-2xl bg-old-button-primary-bg py-3"
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Check size={20} color="#FFFFFF" />
              <Text className="text-base font-semibold text-old-button-primary-text">
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
