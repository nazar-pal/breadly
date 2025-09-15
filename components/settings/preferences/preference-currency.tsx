import { Icon } from '@/components/ui/icon-by-name'
import { useGetUserPreferences } from '@/data/client/queries'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { ModalCurrencies } from './modal-currencies'
import { PreferenceItem } from './preference-item'

export function CurrencyPreference() {
  const { userId } = useUserSession()
  const { data: userPreferences } = useGetUserPreferences({ userId })

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false)

  // Get current currency with fallback to default
  const currentCurrency =
    userPreferences?.[0]?.defaultCurrency || DEFAULT_CURRENCY

  return (
    <>
      <PreferenceItem
        icon={<Icon name="DollarSign" size={20} className="text-primary" />}
        title="Default Currency"
        subtitle={`${currentCurrency.name} (${currentCurrency.symbol})`}
        rightElement={
          <Icon
            name="ChevronRight"
            size={20}
            className="text-muted-foreground"
          />
        }
        onPress={() => setShowCurrencyModal(true)}
      />

      <ModalCurrencies
        showCurrencyModal={showCurrencyModal}
        setShowCurrencyModal={(show: boolean) => {
          setShowCurrencyModal(show)
        }}
      />
    </>
  )
}
