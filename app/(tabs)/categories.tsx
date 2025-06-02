import CalculatorModal from '@/components/shared/CalculatorModal';
import CategoryEditModal from '@/components/shared/CategoryEditModal';
import CategoryGrid from '@/components/shared/CategoryGrid';
import FinancialHeader from '@/components/shared/FinancialHeader';
import { CategoryProvider } from '@/context/CategoryContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Briefcase,
  Building,
  Bus,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Map category names to icons for expenses
const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  Coffee: Coffee,
  Dining: UtensilsCrossed,
  Entertainment: Film,
  Transportation: Bus,
  Health: Heart,
  Home: Home,
  Family: Users,
  Shopping: Shirt,
};

// Map income category names to icons
const incomeCategoryIcons: { [key: string]: React.ComponentType<any> } = {
  Salary: Briefcase,
  Freelance: DollarSign,
  Investment: TrendingUp,
  Business: Building,
  Rental: Home,
  'Side Hustle': Target,
  Other: PiggyBank,
};

function CategoriesContent() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Mock data - in real app these would come from state/API
  const totalExpenses = 1845;
  const totalIncome = 6750;

  const navigateToManageCategories = () => {
    return;
  };

  const getCategoryIcon = (
    categoryName: string,
    type: 'expense' | 'income',
  ) => {
    const icons = type === 'expense' ? categoryIcons : incomeCategoryIcons;
    const IconComponent = icons[categoryName] || Home;
    return <IconComponent size={20} color={colors.text} />;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <FinancialHeader
        totalExpenses={totalExpenses}
        totalIncome={totalIncome}
        onManagePress={navigateToManageCategories}
      />

      <CategoryGrid getIcon={getCategoryIcon} />

      <CalculatorModal />

      <CategoryEditModal />
    </View>
  );
}

export default function CategoriesScreen() {
  return (
    <CategoryProvider>
      <CategoriesContent />
    </CategoryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
