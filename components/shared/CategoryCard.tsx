import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface CategoryCardProps {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  type: 'expense' | 'income';
  onPress: (categoryName: string) => void;
}

export default function CategoryCard({
  id,
  name,
  amount,
  icon,
  type,
  onPress,
}: CategoryCardProps) {
  const { colors } = useTheme();

  const getAmountColor = () => {
    if (type === 'income') {
      return amount > 0 ? colors.success : colors.textSecondary;
    }
    return amount > 0 ? colors.text : colors.textSecondary;
  };

  const getIconBackgroundColor = () => {
    if (type === 'income') {
      return colors.success + '20'; // Light green for income
    }
    return colors.secondary; // Default for expenses
  };

  return (
    <Pressable
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
      onPress={() => onPress(name)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconBackgroundColor() },
        ]}
      >
        {icon}
      </View>
      <View style={styles.categoryContent}>
        <Text
          numberOfLines={1}
          style={[styles.categoryName, { color: colors.text }]}
        >
          {name}
        </Text>
        <Text style={[styles.categoryAmount, { color: getAmountColor() }]}>
          ${amount.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: '47%',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContent: {
    marginLeft: 12,
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 13,
  },
});
