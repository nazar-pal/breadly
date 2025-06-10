import { useCategoryContext } from '@/context/CategoryContext'
import React from 'react'
import { ScrollView } from 'react-native'
import AddCategoryButton from './AddCategoryButton'
import CategoryCard from './CategoryCard'

interface CategoryGridProps {
  getIcon: (categoryName: string, type: 'expense' | 'income') => React.ReactNode
}

export default function CategoryGrid({ getIcon }: CategoryGridProps) {
  const {
    currentCategories,
    currentType,
    activeTab,
    handleCategoryPress,
    handleCategoryLongPress
  } = useCategoryContext()

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
      }}
    >
      {currentCategories.map(category => {
        const amount =
          currentType === 'expense'
            ? 'spent' in category
              ? category.spent
              : 0
            : 'earned' in category
              ? category.earned
              : 0

        return (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            amount={amount}
            icon={getIcon(category.name, currentType)}
            type={currentType}
            onPress={handleCategoryPress}
            onLongPress={handleCategoryLongPress}
          />
        )
      })}

      <AddCategoryButton
        onPress={() => {}} // TODO: Implement add category functionality
        label={activeTab === 'expenses' ? 'Add' : 'Add Category'}
      />
    </ScrollView>
  )
}
