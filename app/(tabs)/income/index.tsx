import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockIncomeSources, mockIncomeTransactions } from '@/data/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import IncomeSourceCard from '@/components/income/IncomeSourceCard';
import IncomeTransactionCard from '@/components/income/IncomeTransactionCard';
import AddIncomeForm from '@/components/income/AddIncomeForm';
import { Plus, ArrowUpRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function IncomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const totalBalance = mockIncomeSources.reduce(
    (sum, source) => sum + source.balance,
    0
  );

  const navigateToManage = () => {
    router.push('/income/manage');
  };

  const handleAddIncome = (data: any) => {
    // Here you would typically save the income to your backend
    console.log('New income:', data);
    setModalVisible(false);
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
        <View style={styles.headerButtons}>
          <Button
            variant="outline"
            onPress={() => setModalVisible(true)}
            leftIcon={<ArrowUpRight size={20} color={colors.text} />}
            style={{ marginRight: 8 }}
          >
            Add Income
          </Button>
          <Button
            variant="primary"
            onPress={navigateToManage}
            leftIcon={<Plus size={20} color="#FFFFFF" />}
          >
            Add Source
          </Button>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Income Sources
        </Text>
        {mockIncomeSources.map((source) => (
          <IncomeSourceCard
            key={source.id}
            source={source}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, marginTop: 24 },
          ]}
        >
          Recent Income
        </Text>
        {mockIncomeTransactions.map((transaction) => (
          <IncomeTransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Income
            </Text>
            <AddIncomeForm
              onSubmit={handleAddIncome}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
});