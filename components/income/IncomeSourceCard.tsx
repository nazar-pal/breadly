import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '../ui/Card';
import IconButton from '../ui/IconButton';
import { Edit2, Trash2, CreditCard, Banknote } from 'lucide-react-native';

interface IncomeSourceCardProps {
  source: {
    id: string;
    name: string;
    description: string;
    balance: number;
    icon: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function IncomeSourceCard({
  source,
  onEdit,
  onDelete,
}: IncomeSourceCardProps) {
  const { colors, spacing } = useTheme();

  const getIcon = () => {
    switch (source.icon) {
      case 'credit-card':
        return <CreditCard size={24} color={colors.text} />;
      case 'banknote':
        return <Banknote size={24} color={colors.text} />;
      default:
        return <CreditCard size={24} color={colors.text} />;
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.secondary },
            ]}
          >
            {getIcon()}
          </View>
          <View style={styles.titleContent}>
            <Text style={[styles.name, { color: colors.text }]}>
              {source.name}
            </Text>
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {source.description}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={<Edit2 size={16} />}
            variant="ghost"
            size="sm"
            onPress={() => onEdit(source.id)}
            style={{ marginRight: spacing.xs }}
          />
          <IconButton
            icon={<Trash2 size={16} />}
            variant="ghost"
            size="sm"
            onPress={() => onDelete(source.id)}
          />
        </View>
      </View>

      <View
        style={[styles.balanceContainer, { backgroundColor: colors.secondary }]}
      >
        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
          Current Balance
        </Text>
        <Text style={[styles.balanceAmount, { color: colors.text }]}>
          ${source.balance.toFixed(2)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceContainer: {
    padding: 12,
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '600',
  },
});