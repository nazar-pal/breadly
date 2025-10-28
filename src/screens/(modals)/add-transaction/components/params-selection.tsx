import { useState } from 'react'
import { View } from 'react-native'
import { useTransactionParamsState } from '../store'
import { Direction, directions } from '../types'
import { SelectionModal } from './selection-modal'
import { SelectionSubcategories } from './selection-subcategories'
import { SelectionTrigger } from './selection-trigger'

export function ParamsSelection() {
  const [showModal, setShowModal] = useState<Direction | null>(null)

  const params = useTransactionParamsState()

  return (
    <>
      <View className="mb-4 flex-row gap-2">
        {directions.map(direction => (
          <SelectionTrigger
            key={direction}
            direction={direction}
            onPress={() => setShowModal(direction)}
          />
        ))}
      </View>

      {params.type !== 'transfer' && <SelectionSubcategories params={params} />}

      <SelectionModal
        visible={showModal !== null}
        direction={showModal ?? 'from'}
        params={params}
        onClose={() => setShowModal(null)}
      />
    </>
  )
}
