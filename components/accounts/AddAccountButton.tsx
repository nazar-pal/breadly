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
          width: '100%',
          padding: 12,
          borderRadius: 12,
          minHeight: 60, // Reduced height for single column
          marginBottom: 8,
          ...Platform.select({
            android: {
              elevation: 1
            },
            default: {
              boxShadow: `0px 1px 2px ${theme.colors.shadowLight}`
            }
          })
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12
        },
        iconContainer: {
          width: 28,
          height: 28,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center'
        },
        label: {
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center'
        }
      }) as const
  )

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSecondary,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: colors.iconBackground.primary
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.iconBackground.primary }
          ]}
        >
          <Plus size={16} color={colors.primary} />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
    </Pressable>
  )
}
