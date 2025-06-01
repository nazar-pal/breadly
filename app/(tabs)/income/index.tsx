import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockIncomeSources, mockIncomeHistory } from '@/data/mockData';
import { ChevronRight, Plus } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { router } from 'expo-router';

export default function IncomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const totalIncome = mockIncomeHistory.reduce((sum, item) => sum + item.amount, 0);

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
        <Text style={[styles.title, { color: colors.text }]}>Income</Text>
        <Button
          variant="primary"
          onPress={navigateToManage}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        >
          Add Income
        </Button>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.totalCard}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            Total Income (This Month)
          </Text>
          <Text style={[styles.totalAmount, { color: colors.success }]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Income Sources
        </Text>
        <Card>
          <Pressable
            style={styles.manageSourcesButton}
            onPress={navigateToManage}
          >
            <View>
              <Text style={[styles.sourcesCount, { color: colors.text }]}>
                {mockIncomeSources.length} Sources
              </Text>
              <Text style={[styles.sourcesHint, { color: colors.textSecondary }]}>
                Tap to manage your income sources
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Income
        </Text>
        {mockIncomeHistory.map((income, index) => (
          <Card key={income.id} style={styles.incomeCard}>
            <View style={styles.incomeDetails}>
              <View>
                <Text style={[styles.incomeSource, { color: colors.text }]}>
                  {income.source}
                </Text>
                <Text
                  style={[styles.incomeDate, { color: colors.textSecondary }]}
                >
                  {income.date}
                </Text>
              </View>
              <Text
                style={[styles.incomeAmount, { color: colors.success }]}
              >
                +${income.amount.toFixed(2)}
              </Text>
            </View>
            {income.description && (
              <Text
                style={[styles.incomeDescription, { color: colors.textSecondary }]}
              >
                {income.description}
              </Text>
            )}
          </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  totalCard: {
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  manageSourcesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourcesCount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sourcesHint: {
    fontSize: 14,
  },
  incomeCard: {
    marginBottom: 12,
  },
  incomeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  incomeDate: {
    fontSize: 14,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeDescription: {
    fontSize: 14,
    marginTop: 8,
  },
});