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
} from '@/lib/icons'
import { createCategory } from '@/powersync/data/mutations'
import React, { use } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import { CategoriesContext } from './categories-context'

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

interface CategoryFormData {
  name: string
  description: string
  selectedIcon: keyof typeof availableIcons
}

export function AddCategoryModal() {
  const { categoryUI, userId } = use(CategoriesContext)
  const insets = useSafeAreaInsets()
  const { addModalVisible, currentType, handleCloseAddModal } = categoryUI

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<CategoryFormData>({
      defaultValues: {
        name: '',
        description: '',
        selectedIcon: 'Home'
      }
    })

  const selectedIcon = watch('selectedIcon')

  const onSubmit = (data: CategoryFormData) => {
    if (!data.name.trim()) {
      return
    }

    createCategory({
      userId,
      data: {
        name: data.name.trim(),
        description: data.description.trim() || '',
        icon: data.selectedIcon.toLowerCase(),
        type: currentType
      }
    })

    reset()
    handleCloseAddModal()
  }

  const getIconBackgroundColor = () => {
    if (currentType === 'income') {
      return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
    }
    return '#F1F5F9' // colors.iconBackground.neutral
  }

  return (
    <View>
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseAddModal}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            onPress={handleCloseAddModal}
          />
          <View
            className="rounded-t-3xl bg-background pt-2"
            style={{
              paddingBottom: insets.bottom + 16,
              height: SCREEN_HEIGHT * 0.8
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
              <Text className="text-xl font-semibold text-foreground">
                Add {currentType === 'expense' ? 'Expense' : 'Income'} Category
              </Text>
              <Pressable onPress={handleCloseAddModal} className="p-1">
                <X size={24} color="#1A202C" />
              </Pressable>
            </View>

            <ScrollView
              className="h-[500px] flex-1 px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              {/* Category Name */}
              <View className="mb-6">
                <Text className="mb-2 text-base font-semibold text-foreground">
                  Category Name
                </Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Category name is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="min-h-[48px] rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter category name"
                      placeholderTextColor="#4A5568"
                      autoFocus
                    />
                  )}
                />
              </View>

              {/* Category Description */}
              <View className="mb-6">
                <Text className="mb-2 text-base font-semibold text-foreground">
                  Description (Optional)
                </Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="h-[100px] rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground"
                      style={{ paddingTop: 12 }}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Add a description for this category"
                      placeholderTextColor="#4A5568"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  )}
                />
              </View>

              {/* Icon Selection */}
              <View className="mb-6">
                <Text className="mb-2 text-base font-semibold text-foreground">
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
                        onPress={() => setValue('selectedIcon', iconName)}
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
            <View className="border-border-light flex-row gap-3 border-t px-5 pb-2 pt-4">
              <Pressable
                className="min-h-[48px] flex-[0.4] flex-row items-center justify-center gap-2 rounded-2xl border py-3"
                onPress={handleCloseAddModal}
              >
                <Text className="text-base font-semibold">Cancel</Text>
              </Pressable>

              <Pressable
                className="min-h-[48px] flex-[0.6] flex-row items-center justify-center gap-2 rounded-2xl py-3"
                onPress={handleSubmit(onSubmit)}
              >
                <Check size={20} color="#FFFFFF" />
                <Text className="text-base font-semibold">Create Category</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
