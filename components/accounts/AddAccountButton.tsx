import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import { Plus } from 'lucide-react-native'
import React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

interface AddAccountButtonProps {
  onPress: () => void
  label?: string
}

export default function AddAccountButton({
  onPress,
  label = 'Add Account'
}: AddAccountButtonProps) {
  const { colors } = useTheme()

  const styles = useThemedStyles(
    theme =>
      ({
        container: {
          backgroundColor: theme.colors.surfaceSecondary,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: theme.colors.iconBackground.primary,
          ...Platform.select({
            android: {
              elevation: 1
            },
            default: {
              boxShadow: `0px 1px 2px ${theme.colors.shadowLight}`
            }
          })
        },
        iconContainer: {
          backgroundColor: theme.colors.iconBackground.primary
        }
      }) as const
  )

  return (
    <Pressable
      className="mb-2 min-h-[60px] w-full rounded-xl p-3"
      style={styles.container}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-center gap-3">
        <View
          className="h-7 w-7 items-center justify-center rounded-md"
          style={styles.iconContainer}
        >
          <Plus size={16} color={colors.primary} />
        </View>
        <Text
          className="text-center text-sm font-semibold"
          style={{ color: colors.text }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  )
}
