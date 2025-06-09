import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import { Plus } from 'lucide-react-native'
import React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

interface AddCategoryButtonProps {
  onPress: () => void
  label?: string
}

export default function AddCategoryButton({
  onPress,
  label = 'Add Category'
}: AddCategoryButtonProps) {
  const { colors } = useTheme()

  const styles = useThemedStyles(theme => ({
    categoryCard: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderStyle: 'dashed' as const,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...Platform.select({
        android: {
          elevation: 1
        },
        default: {
          boxShadow: `0px 2px 4px ${theme.colors.shadowLight}`
        }
      })
    }
  }))

  return (
    <Pressable
      className="w-[47%] flex-row items-center rounded-2xl p-3"
      style={styles.categoryCard}
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center justify-center gap-2">
        <Plus size={20} color={colors.textSecondary} />
        <Text
          className="text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  )
}
