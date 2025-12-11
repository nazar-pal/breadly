import { useCategoriesDateRangeActions } from '@/lib/storage/categories-date-range-store'
import { router } from 'expo-router'
import { CustomDatePicker } from './components/custom-date-picker'

export default function TransactionCustomDateRangeModal() {
  const { closeDateRangeModal } = useCategoriesDateRangeActions()

  /* ------------------------------------------------------------------------ */
  const handleCloseModal = () => {
    router.back()
    closeDateRangeModal()
  }
  return (
    <CustomDatePicker
      onDone={handleCloseModal}
      onCancel={() => router.back()}
    />
  )
}
