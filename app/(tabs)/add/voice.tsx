import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { Mic } from 'lucide-react-native';

export default function VoiceExpenseScreen() {
  const { colors } = useTheme();
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.voiceCard}>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            {isRecording
              ? 'Recording... Speak clearly'
              : 'Tap the microphone and describe your expense'}
          </Text>

          <Text style={[styles.exampleText, { color: colors.textSecondary }]}>
            Example: "I spent $42.50 on groceries at Whole Foods yesterday"
          </Text>

          <View style={styles.waveformContainer}>
            {/* Placeholder for waveform visualization */}
            <View style={[styles.waveform, { backgroundColor: colors.secondary }]} />
          </View>

          <Text style={[styles.timer, { color: colors.textSecondary }]}>
            {isRecording ? '00:05' : '00:00'}
          </Text>
        </Card>

        <View style={styles.micButtonContainer}>
          <Animated.View>
            <View
              style={[
                styles.micButton,
                {
                  backgroundColor: isRecording ? colors.error : colors.primary,
                },
              ]}
              onTouchEnd={handleToggleRecording}>
              <Mic size={32} color="#FFFFFF" />
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  voiceCard: {
    paddingVertical: 24,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  waveformContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  waveform: {
    width: '100%',
    height: 2,
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  micButtonContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});