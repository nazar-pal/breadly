import { Check } from '@/lib/icons'
import { cn } from '@/lib/utils/cn'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Modal } from '../modal'
import { expenseIcons, IconName, incomeIcons } from './category-form-icon'

interface IconSelectionModalProps {
  isVisible: boolean
  onClose: () => void
  selectedIcon: IconName
  onIconSelect: (iconName: IconName) => void
  categoryType: 'income' | 'expense'
}

export function IconSelectionModal({
  isVisible,
  onClose,
  selectedIcon,
  onIconSelect,
  categoryType
}: IconSelectionModalProps) {
  const insets = useSafeAreaInsets()

  const handleIconSelect = (iconName: IconName) => {
    onIconSelect(iconName)
    onClose() // Close modal after selection
  }

  const renderIconButton = (iconName: IconName, IconComponent: any) => {
    const isSelected = selectedIcon === iconName

    return (
      <Pressable
        key={iconName}
        className={cn(
          'h-16 w-16 items-center justify-center rounded-xl border-2',
          // Background colors
          isSelected
            ? categoryType === 'income'
              ? 'bg-green-100'
              : 'bg-indigo-100'
            : 'bg-slate-50',
          // Border colors
          isSelected
            ? categoryType === 'income'
              ? 'border-green-500'
              : 'border-indigo-500'
            : 'border-slate-200'
        )}
        onPress={() => handleIconSelect(iconName)}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <IconComponent
          size={24}
          className={cn(
            // Icon colors
            isSelected
              ? categoryType === 'income'
                ? 'text-green-500'
                : 'text-indigo-500'
              : 'text-slate-500'
          )}
        />
      </Pressable>
    )
  }

  const renderIcons = () => {
    const icons = categoryType === 'income' ? incomeIcons : expenseIcons
    const iconNames = Object.keys(icons) as IconName[]

    // Calculate grid layout - 5 icons per row with proper spacing
    const iconsPerRow = 5
    const rows = []
    for (let i = 0; i < iconNames.length; i += iconsPerRow) {
      rows.push(iconNames.slice(i, i + iconsPerRow))
    }

    return (
      <View className="gap-4">
        <Text className="text-lg font-semibold text-foreground">
          Choose an icon for your {categoryType} category
        </Text>

        {/* Icon Grid */}
        <View className="gap-4">
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-between">
              {row.map(iconName => {
                const IconComponent = icons[iconName as keyof typeof icons]
                return renderIconButton(iconName, IconComponent)
              })}
              {/* Fill empty spaces in the last row to maintain spacing */}
              {row.length < iconsPerRow &&
                Array.from({ length: iconsPerRow - row.length }).map(
                  (_, index) => (
                    <View key={`spacer-${index}`} className="h-16 w-16" />
                  )
                )}
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      height="100%"
      showDragIndicator={false}
      enableSwipeToClose={true}
      enableBackdropClose={true}
      className="bg-background"
    >
      {/* Header with proper safe area padding */}
      <View
        className="flex-row items-center justify-between border-b border-border px-6 py-4"
        style={{
          paddingTop: insets.top + 16 // Add top safe area + extra padding
        }}
      >
        <Text className="text-xl font-bold text-foreground">Select Icon</Text>
        <Pressable
          onPress={onClose}
          className={cn(
            'flex-row items-center gap-2 rounded-lg px-4 py-2',
            categoryType === 'income' ? 'bg-green-500' : 'bg-indigo-500'
          )}
        >
          <Check size={16} className="text-white" />
          <Text className="font-semibold text-white">Done</Text>
        </Pressable>
      </View>

      {/* Content - Improved ScrollView */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 40,
          flexGrow: 1
        }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {renderIcons()}
      </ScrollView>
    </Modal>
  )
}
