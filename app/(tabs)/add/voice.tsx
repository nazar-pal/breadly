import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Mic } from 'lucide-react-native';

export default function VoiceScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.placeholder}>
          <Text style={[styles.voiceHint, { color: colors.textSecondary }]}>
            Tap the microphone and describe your expense
          </Text>
          <Text style={[styles.example, { color: colors.textSecondary }]}>
            Example: "I spent $42.50 on groceries at Whole Foods yesterday"
          </Text>
        </Card>

        <Button
          variant="primary"
          leftIcon={<Mic size={20} color="#fff" />}
          style={{ alignSelf: 'center', marginTop: 24 }}
        >
          Start Recording
        </Button>
      </View>
    </View>
  );
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
    justifyContent: 'center',
  },
  voiceHint: { 
    fontSize: 18, 
    fontWeight: '600', 
    textAlign: 'center' 
  },
  example: { 
    marginTop: 12, 
    textAlign: 'center' 
  },
});