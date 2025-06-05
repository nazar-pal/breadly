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
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end' as const
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.shadow
    },
    modalContent: {
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingTop: theme.spacing.sm,
      minHeight: SCREEN_HEIGHT * 0.6,
      backgroundColor: theme.colors.background
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.lg - 4,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: theme.colors.text
    },
    closeButton: {
      padding: theme.spacing.xs
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg - 4
    },
    scrollContent: {
      paddingVertical: theme.spacing.sm
    },
    formGroup: {
      marginBottom: theme.spacing.xl - 8
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: theme.spacing.sm,
      color: theme.colors.text
    },
    input: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.md * 1.5,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm * 1.5,
      fontSize: 16,
      minHeight: 48,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border
    },
    textArea: {
      height: 100,
      paddingTop: theme.spacing.sm * 1.5,
      textAlignVertical: 'top' as const
    },
    iconGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: theme.spacing.sm * 1.5,
      paddingTop: theme.spacing.sm
    },
    iconOption: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.md * 1.5,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 2
    },
    footer: {
      flexDirection: 'row' as const,
      paddingHorizontal: theme.spacing.lg - 4,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm * 1.5,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight
    },
    button: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: theme.spacing.sm + 6,
      borderRadius: theme.borderRadius.md * 1.5,
      gap: theme.spacing.sm,
      minHeight: 48
    },
    cancelButton: {
      flex: 0.4,
      backgroundColor: theme.colors.button.secondaryBg,
      borderWidth: 1,
      borderColor: theme.colors.button.secondaryBorder
    },
    saveButton: {
      flex: 0.6,
      backgroundColor: theme.colors.button.primaryBg
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600' as const
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
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={handleCloseEditModal} />
        <View
          style={[
            styles.modalContent,
            {
              paddingBottom: insets.bottom + 16,
              maxHeight: SCREEN_HEIGHT * 0.8
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Edit {currentType === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <Pressable
              onPress={handleCloseEditModal}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Category Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter category name"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </View>

            {/* Category Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Icon</Text>
              <View style={styles.iconGrid}>
                {iconNames.map(iconName => {
                  const IconComponent = availableIcons[iconName]
                  const isSelected = selectedIcon === iconName

                  return (
                    <Pressable
                      key={iconName}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor: isSelected
                            ? colors.iconBackground.primary
                            : getIconBackgroundColor(),
                          borderColor: isSelected
                            ? colors.primary
                            : 'transparent'
                        }
                      ]}
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
          <View style={styles.footer}>
            <Pressable
              style={styles.cancelButton}
              onPress={handleCloseEditModal}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: colors.button.secondaryText }
                ]}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Check size={20} color={colors.button.primaryText} />
              <Text
                style={[
                  styles.buttonText,
                  { color: colors.button.primaryText }
                ]}
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
