import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockIncomeSources, mockIncomeHistory } from '@/data/mockData';
import { ChevronRight, Plus } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { router } from 'expo-router';
import IncomeEntryModal from '@/components/income/IncomeEntryModal';

export default function IncomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const totalIncome = mockIncomeHistory.reduce((sum, item) => sum + item.amount, 0);

  const navigateToManage = () => {
    router.push('/income/manage');
  };

  const handleSourcePress = (sourceName: string) => {
    setSelectedSource(sourceName);
    setModalVisible(true);
  };

  const handleIncomeSubmit = (data: { amount: number; description?: string }) => {
    console.log('New income:', { source: selectedSource, ...data });
    setModalVisible(false);
    setSelectedSource(null);
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
          Manage Sources
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
          Add New Income
        </Text>
        <View style={styles.sourcesGrid}>
          {mockIncomeSources.map((source) => (
            <Pressable
              key={source.id}
              style={[
                styles.sourceCard,
                { backgroundColor: colors.card }
              ]}
              onPress={() => handleSourcePress(source.name)}
            >
              <Text style={[styles.sourceName, { color: colors.text }]}>
                {source.name}
              </Text>
              <Plus size={20} color={colors.text} />
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Income
        </Text>
        {mockIncomeHistory.map((income) => (
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

      {selectedSource && (
        <IncomeEntryModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedSource(null);
          }}
          onSubmit={handleIncomeSubmit}
          sourceName={selectedSource}
        />
      )}
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
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  sourceCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
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