import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './Card';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, Mic, Receipt, ArrowRight, Pencil, Trash2 } from 'lucide-react-native';
import IconButton from './IconButton';

interface ExpenseCardProps {
  expense: {
    id: string;
    amount: number;
    category: string;
    date: string;
    description: string;
    hasPhoto?: boolean;
    hasVoice?: boolean;
  };
  expanded?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseCard({ 
  expense, 
  expanded = false,
  onEdit,
  onDelete 
}: ExpenseCardProps) {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push(`/expenses/${expense.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.mainInfo}>
              <Text style={[styles.amount, { color: colors.text }]}>
                ${expense.amount.toFixed(2)}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {expense.category}
                </Text>
              </View>
            </View>
            
            {expanded && expense.description && (
              <Text 
                style={[styles.description, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {expense.description}
              </Text>
            )}

            <View style={styles.metaContainer}>
              <View style={styles.dateContainer}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text style={[styles.dateText, { color: colors.textSecondary, marginLeft: 4 }]}>
                  {formatDate(expense.date)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.rightContent}>
            <View style={styles.iconContainer}>
              {expense.hasPhoto && (
                <Receipt size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
              )}
              {expense.hasVoice && (
                <Mic size={16} color={colors.textSecondary} />
              )}
            </View>

            {expanded ? (
              <View style={styles.actions}>
                <IconButton
                  icon={<Pencil size={16} />}
                  variant="ghost"
                  size="sm"
                  onPress={() => onEdit?.(expense.id)}
                  style={{ marginRight: spacing.xs }}
                />
                <IconButton
                  icon={<Trash2 size={16} />}
                  variant="ghost"
                  size="sm"
                  onPress={() => onDelete?.(expense.id)}
                />
              </View>
            ) : (
              <ArrowRight size={20} color={colors.primary} />
            )}
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
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});