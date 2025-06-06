import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { Camera, Upload } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function PhotoScreen() {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.cameraPlaceholder}>
          <View
            style={[
              styles.cameraIcon,
              { backgroundColor: colors.iconBackground.info }
            ]}
          >
            <Camera size={48} color={colors.info} />
          </View>
          <Text
            style={[
              styles.placeholderText,
              {
                color: colors.textSecondary
              }
            ]}
          >
            Take a photo of your receipt for automatic expense entry
          </Text>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            leftIcon={<Camera size={20} color={colors.textInverse} />}
            style={{ flex: 1, marginRight: 8 }}
          >
            Take Photo
          </Button>
          <Button
            variant="outline"
            leftIcon={<Upload size={20} color={colors.text} />}
            style={{ flex: 1 }}
          >
            Upload
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 16
  },
  cameraPlaceholder: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  placeholderText: {
    textAlign: 'center',
    marginHorizontal: 24,
    fontSize: 16,
    fontWeight: '500'
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16
  }
})
