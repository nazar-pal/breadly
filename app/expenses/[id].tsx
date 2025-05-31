import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { mockExpenses } from '@/data/mockData';
import { Calendar, Receipt, Mic, Tag } from 'lucide-react-native';

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  
  // Find the expense with the matching ID
  const expense = mockExpenses.find(e => e.id === id);
  
  // Placeholder for receipt image
  const receiptImageUrl = 'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  if (!expense) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Expense not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.amountContainer}>
        <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
          Amount
        </Text>
        <Text style={[styles.amount, { color: colors.text }]}>
          ${expense.amount.toFixed(2)}
        </Text>
      </View>
      
      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
            <Calendar size={20} color={colors.text} />
          </View>
          <View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Date
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {expense.date}
            </Text>
          </View>
        </View>
        
        <View
          style={[
            styles.separator,
            { backgroundColor: colors.border },
          ]}
        />
        
        <View style={styles.detailRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
            <Tag size={20} color={colors.text} />
          </View>
          <View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Category
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {expense.category}
            </Text>
          </View>
        </View>
        
        <View
          style={[
            styles.separator,
            { backgroundColor: colors.border },
          ]}
        />
        
        <View style={styles.detailRow}>
          <View style={styles.descriptionContainer}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Description
            </Text>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              {expense.description}
            </Text>
          </View>
        </View>
      </Card>
      
      {expense.hasPhoto && (
        <Card style={styles.attachmentCard}>
          <Text style={[styles.attachmentTitle, { color: colors.text }]}>
            Receipt Photo
          </Text>
          <View style={styles.receiptContainer}>
            <Image
              source={{ uri: receiptImageUrl }}
              style={styles.receiptImage}
              resizeMode="contain"
            />
          </View>
        </Card>
      )}
      
      {expense.hasVoice && (
        <Card style={styles.attachmentCard}>
          <Text style={[styles.attachmentTitle, { color: colors.text }]}>
            Voice Memo
          </Text>
          <View style={[styles.voiceMemoContainer, { backgroundColor: colors.secondary }]}>
            <Mic size={24} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={[styles.voiceMemoText, { color: colors.text }]}>
              Voice Memo (00:12)
            </Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  attachmentCard: {
    marginBottom: 16,
  },
  attachmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  receiptContainer: {
    height: 200,
    overflow: 'hidden',
    borderRadius: 8,
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  voiceMemoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  voiceMemoText: {
    fontSize: 16,
  },
});