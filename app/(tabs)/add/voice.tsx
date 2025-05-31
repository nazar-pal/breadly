import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mic, Square, ArrowLeft, CirclePlay as PlayCircle } from 'lucide-react-native';
import Reanimated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';

export default function VoiceExpenseScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  // Animation for the recording indicator
  const pulseValue = useSharedValue(1);

  React.useEffect(() => {
    if (isRecording) {
      pulseValue.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulseValue.value = 1;
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  const handleProcessVoice = () => {
    // In a real app, this would process the voice recording
    // and pre-fill the expense form with the extracted data
    alert('Voice processed! Continuing to form...');
    router.push('/add/index');
  };

  const WaveformBars = () => {
    // Generate 30 bars with random heights for the waveform visualization
    const bars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      height: Math.random() * 40 + 10,
    }));

    return (
      <View style={styles.waveformContainer}>
        {bars.map((bar) => (
          <View
            key={bar.id}
            style={[
              styles.waveformBar,
              {
                height: bar.height,
                backgroundColor: isRecording ? colors.primary : colors.secondary,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Voice Entry
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.voiceCard}>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            {isRecording
              ? 'Recording... Speak clearly'
              : hasRecording
              ? 'Recording complete'
              : 'Tap the microphone and describe your expense'}
          </Text>

          <Text style={[styles.exampleText, { color: colors.textSecondary }]}>
            Example: "I spent $42.50 on groceries at Whole Foods yesterday"
          </Text>

          <View style={styles.waveformWrapper}>
            <WaveformBars />
          </View>

          <View style={styles.recordingControls}>
            {hasRecording && !isRecording ? (
              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <PlayCircle size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.recordingTime, { color: colors.textSecondary }]}>
                  00:12
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.recordingTime,
                  { color: isRecording ? colors.primary : colors.textSecondary },
                ]}
              >
                {isRecording ? '00:05' : '00:00'}
              </Text>
            )}
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Reanimated.View style={[styles.micButtonContainer, pulseStyle]}>
            <TouchableOpacity
              style={[
                styles.micButton,
                {
                  backgroundColor: isRecording ? colors.error : colors.primary,
                },
              ]}
              onPress={handleToggleRecording}
            >
              {isRecording ? (
                <Square size={24} color="#FFFFFF" />
              ) : (
                <Mic size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </Reanimated.View>

          {hasRecording && (
            <Button
              variant="primary"
              onPress={handleProcessVoice}
              style={{ marginTop: spacing.xl }}
            >
              Process Voice Entry
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
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
  waveformWrapper: {
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  recordingControls: {
    alignItems: 'center',
  },
  recordingTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: 32,
  },
  micButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});