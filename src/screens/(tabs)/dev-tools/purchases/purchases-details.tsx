import { router, type Href } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'

import { usePurchasesStore } from '@/system/purchases'
import Purchases, { PurchasesOfferings } from 'react-native-purchases'

/**
 * Tiny UI atoms kept local for easy reuse.
 */
function TinyStat({
  icon,
  value,
  hint
}: {
  icon?: string
  value: string | number
  hint: string
}) {
  return (
    <View className="flex-1 items-center rounded-md border border-border/50 px-2 py-2">
      <View className="flex-row items-center">
        {icon ? (
          <Icon name={icon} size={12} className="mr-1 text-muted-foreground" />
        ) : null}
        <Text className="text-xs font-medium">{value}</Text>
      </View>
      <Text className="mt-0.5 text-[10px] text-muted-foreground">{hint}</Text>
    </View>
  )
}

function KV({
  k,
  v,
  mono = false
}: {
  k: string
  v?: string | number | null
  mono?: boolean
}) {
  return (
    <View className="flex-row items-center justify-between px-2 py-1.5">
      <Text className="text-[11px] text-muted-foreground">{k}</Text>
      <Text
        className={mono ? 'font-mono text-[11px]' : 'text-[11px] font-medium'}
      >
        {v ?? '—'}
      </Text>
    </View>
  )
}

function JsonFold({ title, data }: { title: string; data: unknown }) {
  const pretty = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }, [data])

  return (
    <AccordionItem value={title}>
      <AccordionTrigger className="px-2 py-2 text-left">
        <View className="flex-row items-center">
          <Icon name="Braces" size={12} className="mr-1 text-primary" />
          <Text className="text-xs">{title}</Text>
          <Badge
            variant="secondary"
            className="ml-2 bg-primary/10 text-primary"
          >
            <Text className="text-[10px]">{pretty.length} chars</Text>
          </Badge>
        </View>
      </AccordionTrigger>
      <AccordionContent className="px-2 pb-2">
        <View className="rounded-md border border-border/50 bg-background/80 p-2">
          <Text
            selectable
            className="font-mono text-[10px] leading-4 text-muted-foreground"
          >
            {pretty}
          </Text>
        </View>
      </AccordionContent>
    </AccordionItem>
  )
}

/**
 * PurchasesDetails (ultra-compact)
 * - single small header line
 * - dense quick actions
 * - one stats row
 * - compact offerings list
 * - compact account block
 * - collapsible JSON
 */
export default function PurchasesScreen() {
  const {
    isPremium,
    customerInfo,
    setCustomerInfo,
    activeEntitlementIds,
    isCustomerInfoFresh
  } = usePurchasesStore()

  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null)
  const [appUserId, setAppUserId] = useState<string | null>(null)
  const currentOffering = offerings?.current ?? null

  // Initial load
  useEffect(() => {
    Purchases.getOfferings()
      .then(setOfferings)
      .catch(() => setOfferings(null))
  }, [])

  useEffect(() => {
    Purchases.getAppUserID()
      .then(id => setAppUserId(id || null))
      .catch(() => setAppUserId(null))
  }, [])

  const handleRefresh = async () => {
    try {
      const [off, info] = await Promise.all([
        Purchases.getOfferings().catch(() => null),
        Purchases.getCustomerInfo().catch(() => null)
      ])
      if (off) setOfferings(off)
      if (info) setCustomerInfo(info)
    } catch (e) {
      console.log('[Purchases] refresh error', e)
    }
  }

  const handleLog = () => {
    console.log('[Purchases] offerings:', offerings)
    console.log('[Purchases] customerInfo:', customerInfo)
  }

  const pkgCount = currentOffering?.availablePackages?.length ?? 0
  const entCount = activeEntitlementIds.length
  const memberSince = customerInfo?.firstSeen
    ? new Date(customerInfo.firstSeen).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null

  return (
    <ScrollView
      contentContainerClassName="gap-2 p-4"
      className="flex-1 bg-background"
    >
      {/* Header + Actions */}

      <View>
        <View className="flex-row items-center justify-between">
          {/* User ID Row */}
          {appUserId && (
            <View className=" flex-row items-center justify-center">
              <Badge
                variant="outline"
                className="border-border/50 bg-background/80"
              >
                <Icon
                  name="Fingerprint"
                  size={12}
                  className="mr-2 text-muted-foreground"
                />
                <Text className="font-mono text-xs">{appUserId}</Text>
              </Badge>
            </View>
          )}
          <View className="flex-row">
            <Button size="icon" className="h-7 w-7" onPress={handleRefresh}>
              <Icon name="RefreshCw" size={12} className="text-white" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="ml-1 h-7 w-7"
              onPress={() => router.push('/paywall' as Href)}
            >
              <Icon name="CreditCard" size={12} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="ml-1 h-7 w-7"
              onPress={handleLog}
            >
              <Icon name="Bug" size={12} className="text-muted-foreground" />
            </Button>
          </View>
        </View>

        {/* Stats (one tight row) */}
        <View className="mt-3 flex-row gap-2">
          <TinyStat
            icon="Crown"
            value={isPremium ? 'Premium' : 'Free'}
            hint="Plan"
          />
          <TinyStat
            icon="ShieldCheck"
            value={isCustomerInfoFresh ? 'Fresh' : 'Cached'}
            hint="CustomerInfo"
          />
          <TinyStat icon="Package" value={pkgCount} hint="Packages" />
          <TinyStat icon="KeyRound" value={entCount} hint="Entitlements" />
        </View>
      </View>

      {/* Current Offering (compact rows) */}
      {currentOffering && (
        <Card>
          <CardContent>
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Icon name="Package" size={12} className="mr-1 text-primary" />
                <Text className="text-xs font-medium">Current Offering</Text>
              </View>
              <Badge variant="outline" className="border-border/50">
                <Text className="text-[10px]">{pkgCount} plans</Text>
              </Badge>
            </View>

            <View className="rounded-md border border-border/40">
              {currentOffering.availablePackages.map((pkg, idx) => (
                <View
                  key={pkg.identifier}
                  className={`px-2 ${idx === 0 ? 'pt-2' : 'py-2'} ${idx === currentOffering.availablePackages.length - 1 ? 'pb-2' : 'border-b border-border/40 pb-2'}`}
                >
                  <View className="flex-row items-start justify-between">
                    <Text className="text-[12px] font-semibold">
                      {pkg.product.title}
                    </Text>
                    <View className="items-end">
                      <Text className="text-base font-bold text-primary">
                        {pkg.product.priceString}
                      </Text>
                      <Text className="text-[10px] text-muted-foreground">
                        {pkg.product.subscriptionPeriod ?? '—'}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-2">
                    <KV k="Product ID" v={pkg.product.identifier} mono />
                    <KV k="Period" v={pkg.product.subscriptionPeriod ?? '—'} />
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      )}

      {/* Account (concise) */}
      {customerInfo && (
        <Card>
          <CardContent>
            <View className="mb-2 flex-row items-center">
              <Icon name="User" size={12} className="mr-1 text-primary" />
              <Text className="text-xs font-medium">Account</Text>
              <Badge
                variant="outline"
                className={`ml-2 ${isPremium ? 'border-amber-500/40 bg-amber-500/10' : 'border-border/50'}`}
              >
                <Text
                  className={`text-[10px] ${isPremium ? 'text-amber-700' : ''}`}
                >
                  {isPremium ? 'Premium' : 'Free'}
                </Text>
              </Badge>
            </View>

            <View className="rounded-md border border-border/40">
              <KV k="App User ID" v={appUserId} mono />
              <View className="h-px bg-border/40" />
              <KV k="Customer ID" v={customerInfo.originalAppUserId} mono />
              <View className="h-px bg-border/40" />
              <KV k="Member Since" v={memberSince} />
              <View className="h-px bg-border/40" />
              <KV
                k="Active Entitlements"
                v={String(
                  Object.keys(customerInfo.entitlements?.active || {}).length
                )}
              />
            </View>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON (collapsible) */}
      <Card className="border border-border/50">
        <CardContent>
          <Accordion
            type="multiple"
            className="rounded-md border border-border/40"
          >
            <JsonFold title="Offerings JSON" data={offerings} />
            <JsonFold title="CustomerInfo JSON" data={customerInfo} />
          </Accordion>
        </CardContent>
      </Card>
    </ScrollView>
  )
}
