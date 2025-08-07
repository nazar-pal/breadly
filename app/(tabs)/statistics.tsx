import { CenteredModal } from '@/components/modals/centered-modal'
import { CategoryBudgetForm } from '@/modules/budget/components'
import {
  CategoryBreakdown,
  SummaryCards,
  TopExpenses
} from '@/modules/statistics/components'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets()

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState<
    string | null
  >(null)

  const openBudgetModal = (categoryId: string) => {
    setSelectedCategoryForBudget(categoryId)
    setIsBudgetModalOpen(true)
  }

  const closeBudgetModal = () => {
    setIsBudgetModalOpen(false)
    setSelectedCategoryForBudget(null)
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 16
        }}
      >
        <View className="px-4 py-4">
          <SummaryCards />
          <CategoryBreakdown onOpenBudgetModal={openBudgetModal} />
          <TopExpenses />
        </View>
      </ScrollView>

      <CenteredModal
        visible={isBudgetModalOpen}
        onRequestClose={closeBudgetModal}
      >
        <CategoryBudgetForm
          categoryId={selectedCategoryForBudget ?? ''}
          onClose={closeBudgetModal}
        />
      </CenteredModal>
    </>
  )
}
