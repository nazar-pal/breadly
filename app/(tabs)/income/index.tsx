import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockIncomeSources } from '@/data/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import IncomeSourceCard from '@/components/income/IncomeSourceCard';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export default function IncomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const totalBalance = mockIncomeSources.reduce(
    (sum, source) => sum + source.balance,
    0
  );

  const navigateToManage = () => {
    router.push('/income/manage');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            Total Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            ${totalBalance.toFixed(2)}
          </Text>
        </View>
        <Button
          variant="primary"
          onPress={navigateToManage}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        >
          Add Source
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {mockIncomeSources.map((source) => (
          <IncomeSourceCard
            key={source.id}
            source={source}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});