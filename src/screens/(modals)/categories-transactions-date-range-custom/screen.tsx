import { useCategoriesDateRangeActions } from '@/lib/storage/categories-date-range-store'
import { router } from 'expo-router'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { CustomDatePicker } from './components/custom-date-picker'

export default function TransactionCustomDateRangeModal() {
  const { closeDateRangeModal } = useCategoriesDateRangeActions()

  /* ------------------------------------------------------------------------ */
  const handleCloseModal = () => {
    router.back()
    closeDateRangeModal()
  }
  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover p-4"
    >
      <CustomDatePicker
        onDone={handleCloseModal}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  )
}
