import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useGetTransaction } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import { useUserSession } from '@/system/session-and-migration'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Legacy DetailItem removed in favor of TimelineItem

// -----------------------------------------------------------------------------
// New UI building blocks
// -----------------------------------------------------------------------------

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded bg-muted/60 px-2 py-1">
      <Text className="text-[11px] font-medium text-muted-foreground">
        {children}
      </Text>
    </View>
  )
}

function TimelineItem({
  icon,
  label,
  value,
  children,
  isFirst,
  isLast
}: {
  icon: IconName
  label: string
  value?: string
  children?: React.ReactNode
  isFirst?: boolean
  isLast?: boolean
}) {
  return (
    <View className="relative flex-row py-3">
      <View className="mr-3 w-6 items-center">
        {!isFirst && (
          <View className="absolute top-0 h-1/2 w-[1px] bg-border" />
        )}
        <View className="h-3 w-3 rounded-full bg-primary" />
        {!isLast && (
          <View className="absolute bottom-0 h-1/2 w-[1px] bg-border" />
        )}
      </View>
      <View className="flex-1">
        <View className="mb-1 flex-row items-center gap-2">
          <Icon name={icon} size={16} className="text-muted-foreground" />
          <Text className="text-xs text-muted-foreground">{label}</Text>
        </View>
        {children ? (
          <View>{children}</View>
        ) : (
          <Text className="text-base font-medium text-foreground">{value}</Text>
        )}
      </View>
    </View>
  )
}

function CategoryBreadcrumb({
  type,
  parentName,
  parentIcon,
  childName,
  childIcon
}: {
  type: 'income' | 'expense' | 'transfer'
  parentName?: string | null
  parentIcon?: IconName | null
  childName?: string | null
  childIcon?: IconName | null
}) {
  // Use uniform neutral styling for both parent and child badges

  if (!parentName && !childName) {
    return (
      <View className="rounded bg-muted/60 px-2 py-1">
        <Text className="text-[11px] font-medium text-muted-foreground">
          Uncategorized
        </Text>
      </View>
    )
  }

  if (!parentName && childName) {
    return (
      <View className="flex-row items-center rounded-full bg-muted/60 px-2 py-1">
        <Icon
          name={(childIcon as IconName) || 'Tag'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="ml-1 text-[11px] font-medium text-muted-foreground">
          {childName}
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-row items-center gap-1.5">
      <View className="flex-row items-center rounded-full bg-muted/60 px-2 py-1">
        <Icon
          name={(parentIcon as IconName) || 'Folder'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="ml-1 text-[11px] font-medium text-muted-foreground">
          {parentName}
        </Text>
      </View>
      <Icon
        name="ChevronRight"
        size={14}
        className="text-muted-foreground/60"
      />
      <View className="flex-row items-center rounded-full bg-muted/60 px-2 py-1">
        <Icon
          name={(childIcon as IconName) || 'Tag'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="ml-1 text-[11px] font-medium text-muted-foreground">
          {childName}
        </Text>
      </View>
    </View>
  )
}

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()
  const transactions = useGetTransaction({
    userId,
    transactionId: id
  })

  const transaction = transactions.data?.[0]

  const receipts = (transaction?.transactionAttachments ?? [])
    .map(ta => ta.attachment)
    .filter(att => att && att.type === 'receipt') as NonNullable<
    typeof transaction
  >['transactionAttachments'][number]['attachment'][]

  const voiceMemos = (transaction?.transactionAttachments ?? [])
    .map(ta => ta.attachment)
    .filter(att => att && att.type === 'voice') as NonNullable<
    typeof transaction
  >['transactionAttachments'][number]['attachment'][]

  const getTypeConfig = (type: 'income' | 'expense' | 'transfer') => {
    switch (type) {
      case 'income':
        return {
          icon: 'TrendingUp' as const,
          color: 'text-income',
          bg: 'bg-income/10'
        }
      case 'expense':
        return {
          icon: 'TrendingDown' as const,
          color: 'text-destructive',
          bg: 'bg-destructive/10'
        }
      case 'transfer':
        return {
          icon: 'RefreshCw' as const,
          color: 'text-primary',
          bg: 'bg-primary/10'
        }
      default:
        return {
          icon: 'Circle' as const,
          color: 'text-foreground',
          bg: 'bg-muted/40'
        }
    }
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

  const formatDateTime = (date: Date) =>
    date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  const formatDuration = (seconds?: number | null) => {
    if (!seconds || seconds <= 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (!transaction) {
    return (
      <View className="flex-1 bg-background">
        <Text className="mt-10 text-center text-lg text-destructive">
          Transaction not found
        </Text>
      </View>
    )
  }

  // legacy path kept as reference (not rendered)

  const currencyCode =
    transaction.currencyId || transaction.account?.currencyId || 'USD'
  const amountDisplay = formatCurrencyWithSign(
    transaction.type === 'expense' ? -transaction.amount : transaction.amount,
    currencyCode
  )

  const typeConfig = getTypeConfig(
    transaction.type as 'income' | 'expense' | 'transfer'
  )

  const isTransfer = transaction.type === 'transfer'

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 16
      }}
    >
      {/* Hero Header */}
      <View className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-b from-primary/10 to-background p-4">
        <View className="flex-row items-center">
          <View
            className={cn(
              'mr-3 h-10 w-10 items-center justify-center rounded-2xl',
              typeConfig.bg
            )}
          >
            <Icon
              name={typeConfig.icon}
              size={20}
              className={typeConfig.color}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[28px] font-extrabold tracking-tight text-foreground">
              {amountDisplay}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {formatDate(transaction.txDate)}
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          {transaction.category && (
            <CategoryBreadcrumb
              type={transaction.type as 'income' | 'expense' | 'transfer'}
              parentName={transaction.category.parent?.name}
              parentIcon={
                (transaction.category.parent?.icon as IconName) || null
              }
              childName={transaction.category.name}
              childIcon={(transaction.category.icon as IconName) || null}
            />
          )}
          <Chip>
            {transaction.type.charAt(0).toUpperCase() +
              transaction.type.slice(1)}
          </Chip>
          <Chip>{currencyCode}</Chip>
        </View>
      </View>

      {/* Timeline Details */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          {isTransfer ? (
            <>
              <TimelineItem
                icon="Wallet"
                label="From Account"
                value={transaction.account?.name ?? '—'}
                isFirst
              />
              <TimelineItem
                icon="ArrowRight"
                label="To Account"
                value={transaction.counterAccount?.name ?? '—'}
              />
            </>
          ) : (
            <TimelineItem
              icon="Wallet"
              label="Account"
              value={transaction.account?.name ?? '—'}
              isFirst
            />
          )}
          <TimelineItem icon="Tag" label="Category">
            <CategoryBreadcrumb
              type={transaction.type as 'income' | 'expense' | 'transfer'}
              parentName={transaction.category?.parent?.name}
              parentIcon={
                (transaction.category?.parent?.icon as IconName) || null
              }
              childName={transaction.category?.name}
              childIcon={(transaction.category?.icon as IconName) || null}
            />
          </TimelineItem>
          <TimelineItem
            icon="Calendar"
            label="Date"
            value={formatDate(transaction.txDate)}
          />
          <TimelineItem icon="Banknote" label="Currency" value={currencyCode} />
          <TimelineItem
            icon="Clock"
            label="Created"
            value={formatDateTime(
              new Date(transaction.createdAt as unknown as Date)
            )}
            isLast={!transaction.notes}
          />
          {transaction.notes && (
            <TimelineItem
              icon="Text"
              label="Notes"
              value={transaction.notes}
              isLast
            />
          )}
        </CardContent>
      </Card>

      {/* Receipts */}
      {receipts.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {receipts.map(att => (
                <View
                  key={att!.id}
                  className="w-[48.5%] overflow-hidden rounded-xl bg-secondary"
                >
                  <Image
                    source={{ uri: att!.bucketPath || undefined }}
                    className="h-40 w-full"
                    resizeMode="cover"
                  />
                  <View className="px-2 py-1">
                    <Text
                      numberOfLines={1}
                      className="text-[11px] text-muted-foreground"
                    >
                      {att!.fileName}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      )}

      {/* Voice Memos */}
      {voiceMemos.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Voice Memos</CardTitle>
          </CardHeader>
          <CardContent>
            {voiceMemos.map(att => (
              <View
                key={att!.id}
                className="mb-2 flex-row items-center rounded-lg bg-secondary/50 p-3"
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon name="Mic" size={18} className="text-primary" />
                </View>
                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-medium text-foreground"
                  >
                    {att!.fileName}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {formatDuration(att!.duration)}
                  </Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      )}
    </ScrollView>
  )
}
