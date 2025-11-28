import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import {
  CalendarCheck,
  PlusCircle,
  Receipt,
  Sparkles
} from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View, useColorScheme } from 'react-native'

export function EmptyTodayMessage() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View
      className={cn(
        'mb-1.5 flex-row items-center rounded-xl px-3 py-2.5',
        isDark ? 'bg-secondary/20' : 'bg-muted/40'
      )}
    >
      <View
        className={cn(
          'mr-2.5 h-8 w-8 items-center justify-center rounded-lg',
          isDark ? 'bg-primary/15' : 'bg-primary/10'
        )}
      >
        <Icon as={CalendarCheck} size={15} className="text-primary" />
      </View>
      <Text
        className={cn(
          'text-xs',
          isDark ? 'text-white/50' : 'text-muted-foreground'
        )}
      >
        No transactions yet today · Tap a category to add one
      </Text>
    </View>
  )
}

export function NoTransactionsState() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const gradientColors: [string, string] = isDark
    ? ['#2d1f4e', '#1a1635']
    : ['#f3f0ff', '#ede9fe']

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <View className="w-full max-w-sm">
        {/* Illustration Card */}
        <View className="shadow-primary/10 mb-6 overflow-hidden rounded-2xl shadow-lg">
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16 }}
          >
            <View className="items-center px-6 py-8">
              {/* Icon Stack */}
              <View className="relative mb-4">
                <View
                  className={cn(
                    'h-16 w-16 items-center justify-center rounded-2xl',
                    isDark ? 'bg-white/10' : 'bg-white/80'
                  )}
                >
                  <Icon
                    as={Receipt}
                    size={32}
                    className={isDark ? 'text-white/80' : 'text-primary'}
                  />
                </View>
                <View
                  className={cn(
                    'absolute -top-1.5 -right-1.5 h-6 w-6 items-center justify-center rounded-full',
                    isDark ? 'bg-primary/30' : 'bg-primary/20'
                  )}
                >
                  <Icon as={Sparkles} size={12} className="text-primary" />
                </View>
              </View>

              <Text
                className={cn(
                  'mb-1.5 text-center text-lg font-bold',
                  isDark ? 'text-white' : 'text-foreground'
                )}
              >
                Start Tracking Today
              </Text>
              <Text
                className={cn(
                  'text-center text-xs leading-relaxed',
                  isDark ? 'text-white/60' : 'text-muted-foreground'
                )}
              >
                Your financial journey begins with a single transaction.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* CTA Button */}
        <Link href={{ pathname: '/', params: { type: 'expense' } }} asChild>
          <Pressable
            className={cn(
              'flex-row items-center justify-center gap-2 rounded-xl px-5 py-3',
              'active:opacity-80',
              'bg-primary'
            )}
          >
            <Icon as={PlusCircle} size={18} className="text-white" />
            <Text className="text-sm font-semibold text-white">
              Add Your First Transaction
            </Text>
          </Pressable>
        </Link>

        <Text
          className={cn(
            'mt-3 text-center text-[10px]',
            isDark ? 'text-white/35' : 'text-muted-foreground/60'
          )}
        >
          Or browse the Categories tab
        </Text>
      </View>
    </View>
  )
}

export function LoadingState() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className="bg-background flex-1 px-4 pt-4">
      {/* Section header skeleton */}
      <View className="mb-2 flex-row items-center gap-1.5 px-0.5">
        <Skeleton className="h-1 w-1 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </View>

      {/* Transaction skeletons */}
      {[1, 2, 3].map(i => (
        <View
          key={i}
          className={cn(
            'mb-1.5 flex-row items-center rounded-xl px-3 py-2.5',
            isDark ? 'bg-secondary/30' : 'bg-muted/30'
          )}
          style={{ borderLeftWidth: 2.5, borderLeftColor: 'transparent' }}
        >
          <Skeleton className="mr-2.5 h-8 w-8 rounded-lg" />
          <View className="flex-1">
            <Skeleton className="mb-1.5 h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </View>
          <Skeleton className="h-3.5 w-12" />
        </View>
      ))}

      {/* Earlier section skeleton */}
      <View className="mt-4 mb-2 flex-row items-center gap-1.5 px-0.5">
        <Skeleton className="h-1 w-1 rounded-full" />
        <Skeleton className="h-3 w-14" />
      </View>

      {[4, 5].map(i => (
        <View
          key={i}
          className={cn(
            'mb-1.5 flex-row items-center rounded-xl px-3 py-2.5',
            isDark ? 'bg-secondary/30' : 'bg-muted/30'
          )}
          style={{ borderLeftWidth: 2.5, borderLeftColor: 'transparent' }}
        >
          <Skeleton className="mr-2.5 h-8 w-8 rounded-lg" />
          <View className="flex-1">
            <Skeleton className="mb-1.5 h-3.5 w-2/3" />
            <Skeleton className="h-2.5 w-1/3" />
          </View>
          <Skeleton className="h-3.5 w-10" />
        </View>
      ))}
    </View>
  )
}
