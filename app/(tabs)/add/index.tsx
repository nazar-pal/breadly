import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Pencil, Camera, Mic } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

type InputMode = 'manual' | 'photo' | 'voice';

const MODES: InputMode[] = ['manual', 'photo', 'voice'];

export default function AddExpenseScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<InputMode>('manual');
  
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const handleSubmitExpense = (expenseData: any) => {
    console.log('Submitting expense:', expenseData);
    router.back();
  };

  const handleModeChange = (newMode: InputMode) => {
    if (newMode === 'photo') {
      router.push('/add/photo');
    } else if (newMode === 'voice') {
      router.push('/add/voice');
    } else {
      setMode(newMode);
    }
  };

  const updateMode = (direction: number) => {
    const currentIndex = MODES.indexOf(mode);
    const newIndex = Math.max(0, Math.min(MODES.length - 1, currentIndex + direction));
    const newMode = MODES[newIndex];
    handleModeChange(newMode);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const threshold = 100;

      if (Math.abs(velocity) > threshold) {
        if (velocity > 0) {
          runOnJS(updateMode)(-1);
        } else {
          runOnJS(updateMode)(1);
        }
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.modeSelectorContainer}>
        <TouchableOpacity
          style={[
            styles.modeTab,
            mode === 'manual' && { 
              borderBottomWidth: 2,
              borderBottomColor: colors.primary 
            },
          ]}
          onPress={() => handleModeChange('manual')}
        >
          <Pencil
            size={20}
            color={mode === 'manual' ? colors.primary : colors.textSecondary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.modeText,
              {
                color: mode === 'manual' ? colors.primary : colors.textSecondary,
                fontWeight: mode === 'manual' ? '600' : '400',
              },
            ]}
          >
            Manual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            mode === 'photo' && { 
              borderBottomWidth: 2,
              borderBottomColor: colors.primary 
            },
          ]}
          onPress={() => handleModeChange('photo')}
        >
          <Camera
            size={20}
            color={mode === 'photo' ? colors.primary : colors.textSecondary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.modeText,
              {
                color: mode === 'photo' ? colors.primary : colors.textSecondary,
                fontWeight: mode === 'photo' ? '600' : '400',
              },
            ]}
          >
            Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            mode === 'voice' && { 
              borderBottomWidth: 2,
              borderBottomColor: colors.primary 
            },
          ]}
          onPress={() => handleModeChange('voice')}
        >
          <Mic
            size={20}
            color={mode === 'voice' ? colors.primary : colors.textSecondary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.modeText,
              {
                color: mode === 'voice' ? colors.primary : colors.textSecondary,
                fontWeight: mode === 'voice' ? '600' : '400',
              },
            ]}
          >
            Voice
          </Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.formContainer, animatedStyle]}>
          <ExpenseForm onSubmit={handleSubmitExpense} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modeText: {
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
});