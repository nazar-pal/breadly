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
      width: '47%' as const,
      padding: theme.spacing.sm * 1.5,
      borderRadius: theme.borderRadius.md * 2,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.surfaceSecondary,
      borderStyle: 'dashed' as const,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadowLight,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4
        },
        android: {
          elevation: 1
        },
        web: {
          boxShadow: `0px 2px 4px ${theme.colors.shadowLight}`
        }
      })
    },
    addButtonContent: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: theme.spacing.sm
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: theme.colors.textSecondary
    }
  }))

  return (
    <Pressable style={styles.categoryCard} onPress={onPress}>
      <View style={styles.addButtonContent}>
        <Plus size={20} color={colors.textSecondary} />
        <Text style={styles.addButtonText}>{label}</Text>
      </View>
    </Pressable>
  )
}
