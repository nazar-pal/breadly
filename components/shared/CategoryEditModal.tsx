import { useCategoryContext } from '@/context/CategoryContext'
import { useTheme, useThemedStyles } from '@/context/ThemeContext'
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
  StyleSheet,
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
  const { colors } = useTheme()
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

  const styles = useThemedStyles(theme => ({
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.shadow
    },
    modalContent: {
      backgroundColor: theme.colors.background
    },
    input: {
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border
    },
    cancelButton: {
      backgroundColor: theme.colors.button.secondaryBg,
      borderWidth: 1,
      borderColor: theme.colors.button.secondaryBorder
    },
    saveButton: {
      backgroundColor: theme.colors.button.primaryBg
    }
  }))

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
      return colors.iconBackground.success
    }
    return colors.iconBackground.neutral
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
        <Pressable style={styles.modalOverlay} onPress={handleCloseEditModal} />
        <View
          className="rounded-t-3xl pt-2"
          style={[
            styles.modalContent,
            {
              paddingBottom: insets.bottom + 16,
              maxHeight: SCREEN_HEIGHT * 0.8
            }
          ]}
        >
          {/* Header */}
          <View
            className="flex-row items-center justify-between border-b px-5 py-4"
            style={{ borderBottomColor: colors.border }}
          >
            <Text
              className="text-xl font-semibold"
              style={{ color: colors.text }}
            >
              Edit {currentType === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <Pressable onPress={handleCloseEditModal} className="p-1">
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {/* Category Name */}
            <View className="mb-6">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: colors.text }}
              >
                Category Name
              </Text>
              <TextInput
                className="min-h-[48px] rounded-2xl border px-4 py-3 text-base"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter category name"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </View>

            {/* Category Description */}
            <View className="mb-6">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: colors.text }}
              >
                Description (Optional)
              </Text>
              <TextInput
                className="h-[100px] rounded-2xl border px-4 py-3 text-base"
                style={[styles.input, { paddingTop: 12 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description for this category"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Icon Selection */}
            <View className="mb-6">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: colors.text }}
              >
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
                          ? colors.iconBackground.primary
                          : getIconBackgroundColor(),
                        borderColor: isSelected ? colors.primary : 'transparent'
                      }}
                      onPress={() => setSelectedIcon(iconName)}
                    >
                      <IconComponent
                        size={24}
                        color={isSelected ? colors.primary : colors.text}
                      />
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View
            className="flex-row gap-3 border-t px-5 pb-2 pt-4"
            style={{ borderTopColor: colors.borderLight }}
          >
            <Pressable
              className="min-h-[48px] flex-[0.4] flex-row items-center justify-center gap-2 rounded-2xl py-3"
              style={styles.cancelButton}
              onPress={handleCloseEditModal}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.button.secondaryText }}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              className="min-h-[48px] flex-[0.6] flex-row items-center justify-center gap-2 rounded-2xl py-3"
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Check size={20} color={colors.button.primaryText} />
              <Text
                className="text-base font-semibold"
                style={{ color: colors.button.primaryText }}
              >
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
