import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowRight, Calendar, Mic, Receipt } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Card from '../ui/Card';

interface Operation {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'expense' | 'income';
  hasPhoto?: boolean;
  hasVoice?: boolean;
}

interface OperationCardProps {
  operation: Operation;
}

export default function OperationCard({ operation }: OperationCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push(`/expenses/${operation.id}`);
  };

  const getAmountColor = () => {
    return operation.amount >= 0 ? colors.success : colors.error;
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <Text style={[styles.amount, { color: getAmountColor() }]}>
              ${Math.abs(operation.amount).toFixed(2)}
            </Text>
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {operation.description}
            </Text>
            <View style={styles.metaContainer}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {operation.category}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.dateText,
                    { color: colors.textSecondary, marginLeft: 4 },
                  ]}
                >
                  {operation.date}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.iconContainer}>
              {operation.hasPhoto && (
                <Receipt
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
              )}
              {operation.hasVoice && (
                <Mic size={16} color={colors.textSecondary} />
              )}
            </View>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
});