import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, LocationEdit as Edit2, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import IconButton from '@/components/ui/IconButton';

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const totalBalance = -1955; // This would come from your data
  const totalExpenses = 110; // This would come from your data
  const totalIncome = 0; // This would come from your data

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setModalVisible(true);
  };

  const handleExpenseSubmit = (data: any) => {
    // Handle the expense submission
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const navigateToManageCategories = () => {
    router.push('/categories/manage');
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          paddingTop: insets.top 
        }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            Total Balance
          </Text>
          <IconButton
            icon={<Edit2 size={20} />}
            variant="ghost"
            onPress={navigateToManageCategories}
          />
        </View>
        <Text style={[styles.balanceAmount, { color: colors.text }]}>
          ${Math.abs(totalBalance).toFixed(2)}
        </Text>
        
        {/* Date Range Selector */}
        <View style={styles.dateSelector}>
          <ChevronLeft size={24} color={colors.text} />
          <Text style={[styles.dateRange, { color: colors.text }]}>
            26 - 01 June 2025
          </Text>
          <ChevronRight size={24} color={colors.text} />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View 
            style={[
              styles.summaryCard, 
              { backgroundColor: colors.card }
            ]}
          >
            <Text style={[styles.summaryLabel, { color: colors.error }]}>
              Expenses
            </Text>
            <Text style={[styles.summaryAmount, { color: colors.error }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>
          <View 
            style={[
              styles.summaryCard, 
              { backgroundColor: colors.card }
            ]}
          >
            <Text style={[styles.summaryLabel, { color: colors.success }]}>
              Income
            </Text>
            <Text style={[styles.summaryAmount, { color: colors.success }]}>
              ${totalIncome.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Categories Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
      >
        {mockCategories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: colors.card }
            ]}
            onPress={() => handleCategoryPress(category.name)}
          >
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: colors.secondary }
              ]}
            >
              {/* You would replace this with the actual icon component */}
              <View style={[styles.iconPlaceholder, { backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>
              {category.name}
            </Text>
            <Text 
              style={[
                styles.categoryAmount,
                { color: category.spent > 0 ? colors.text : colors.textSecondary }
              ]}
            >
              ${category.spent.toFixed(2)}
            </Text>
          </Pressable>
        ))}
        
        {/* Add Category Button */}
        <Pressable
          style={[
            styles.categoryCard,
            styles.addButton,
            { 
              backgroundColor: colors.secondary,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: colors.border
            }
          ]}
          onPress={navigateToManageCategories}
        >
          <Plus size={24} color={colors.text} />
          <Text style={[styles.addButtonText, { color: colors.text }]}>
            Add
          </Text>
        </Pressable>
      </ScrollView>

      {/* Quick Add Expense Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: colors.background,
                paddingBottom: insets.bottom
              }
            ]}
          >
            <ExpenseForm
              onSubmit={handleExpenseSubmit}
              initialData={
                selectedCategory ? { category: selectedCategory } : undefined
              }
            />
          </View>
        </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  dateRange: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    padding: 16,
    borderRadius: 16,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 14,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
});