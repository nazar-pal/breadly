import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { useTheme } from '@/context/ThemeContext';
import { CreditCard as Edit2, Trash2, Lock } from 'lucide-react-native';
import IconButton from '../ui/IconButton';

interface IncomeSourceCardProps {
  source: {
    id: string;
    name: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDefault?: boolean;
}

export default function IncomeSourceCard({
  source,
  onEdit,
  onDelete,
  isDefault,
}: IncomeSourceCardProps) {
  const { colors, spacing } = useTheme();

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: colors.text }]}>
            {source.name}
          </Text>
          {isDefault && (
            <View
              style={[
                styles.defaultBadge,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Lock size={12} color={colors.text} />
              <Text
                style={[styles.defaultText, { color: colors.text }]}
              >
                Default
              </Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={<Edit2 size={16} />}
            variant="ghost"
            size="sm"
            onPress={() => onEdit(source.id)}
            style={{ marginRight: spacing.xs }}
            disabled={isDefault}
          />
          <IconButton
            icon={<Trash2 size={16} />}
            variant="ghost"
            size="sm"
            onPress={() => onDelete(source.id)}
            disabled={isDefault}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
});