import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Pencil, Camera, Mic } from 'lucide-react-native';

type InputMode = 'manual' | 'photo' | 'voice';

export default function AddExpenseScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<InputMode>('manual');

  const handleSubmitExpense = (data: any) => {
    // In a real app, this would save the expense to a database
    // For this MVP, we'll just navigate back to the dashboard
    alert('Expense saved successfully!');
    router.push('/');
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Add Expense
        </Text>
      </View>

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

      <ExpenseForm onSubmit={handleSubmitExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
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
});