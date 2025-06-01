import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ExpenseForm from '@/components/expenses/ExpenseForm';

import { router } from 'expo-router';

export default function AddExpenseScreen() {
  const { colors } = useTheme();

  const handleSubmitExpense = (data: any) => {
    // TODO: persist `data`
    Alert.alert('Success', 'Expense saved successfully!');
    router.push('/');
  };

  return (
 
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ExpenseForm onSubmit={handleSubmitExpense} />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, // keeps form aligned with Photo / Voice screens
  },
});
