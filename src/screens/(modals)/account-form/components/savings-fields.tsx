import { FormDateField, FormInputField } from '@/components/form-fields'
import { OpenBottomSheetPicker } from '../lib/types'

interface Props {
  openPicker: OpenBottomSheetPicker
  setOpenPicker: (picker: OpenBottomSheetPicker) => void
}

export function SavingsFields({ openPicker, setOpenPicker }: Props) {
  return (
    <>
      <FormInputField
        name="savingsTargetAmount"
        label="Savings goal (optional)"
        placeholder="Goal amount"
        kind="number"
      />
      <FormDateField
        name="savingsTargetDate"
        label="Target date (optional)"
        placeholder="Target date"
        isPickerOpen={openPicker === 'targetDate'}
        openPicker={() => setOpenPicker('targetDate')}
        closePicker={() => setOpenPicker(null)}
        drawerTitle="Pick target date"
        safeBottomPadding
        height="auto"
      />
    </>
  )
}
