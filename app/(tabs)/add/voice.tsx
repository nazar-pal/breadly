import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { Mic } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function VoiceScreen() {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.placeholder}>
          <View
            style={[
              styles.micIcon,
              { backgroundColor: colors.iconBackground.warning }
            ]}
          >
            <Mic size={48} color={colors.warning} />
          </View>
          <Text style={[styles.voiceHint, { color: colors.text }]}>
            Tap the microphone and describe your expense
          </Text>
          <Text style={[styles.example, { color: colors.textSecondary }]}>
            Example: &ldquo;I spent $42.50 on groceries at Whole Foods
            yesterday&rdquo;
          </Text>
        </Card>

        <Button
          variant="primary"
          leftIcon={<Mic size={20} color={colors.textInverse} />}
          style={{ alignSelf: 'center', marginTop: 24 }}
        >
          Start Recording
        </Button>
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
  placeholder: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center'
  },
  micIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  voiceHint: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8
  },
  example: {
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic'
  }
})
