import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import Head from 'expo-router/head'
import React from 'react'
import { ScrollView, View } from 'react-native'

const APP_NAME = 'Breadly'
const TAGLINE = 'Track spending. Budget smarter. Grow savings.'
const DESCRIPTION =
  'Breadly is a fast, privacy-first expense tracker that helps you capture transactions in seconds, understand where your money goes, and build better money habits — without ads.'

const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.devnazar.breadly'
// If your App Store URL is known, replace the search link below with the exact app URL.
const APP_STORE_URL =
  'https://apps.apple.com/us/search?term=Breadly%20Expense%20Tracker'

const FEATURES = [
  {
    title: 'Lightning‑fast entry',
    description:
      'Add transactions in seconds with a built‑in calculator, smart defaults, and thoughtful shortcuts.'
  },
  {
    title: 'Beautiful organization',
    description:
      'Clean categories, powerful filters, and clear lists keep your finances organized and calm.'
  },
  {
    title: 'Insights that matter',
    description:
      'Monthly summaries, trends, and simple visualizations help you see the big picture at a glance.'
  },
  {
    title: 'Privacy‑first',
    description:
      'Use Breadly completely offline — your data stays on your device. No ads. No tracking.'
  },
  {
    title: 'Optional cloud sync',
    description:
      'Enable secure sync to back up your data and keep multiple devices in harmony.'
  },
  {
    title: 'Multi‑currency ready',
    description:
      'Track expenses across currencies with sensible defaults and clear conversions.'
  }
]

export default function WebLandingPage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} — Expense Tracker & Budgeting</title>
        <meta
          name="description"
          content="Breadly is a fast, privacy‑first expense tracker with beautiful organization, meaningful insights, and optional secure cloud sync."
        />
      </Head>

      <ScrollView className="flex-1">
        <View className="from-background to-accent/40 bg-gradient-to-b">
          <View className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <View className="flex flex-col items-center gap-5 text-center">
              <Text variant="h1">{APP_NAME}</Text>
              <Text variant="lead">{TAGLINE}</Text>
              <Text variant="p" className="text-muted-foreground max-w-2xl">
                {DESCRIPTION}
              </Text>

              <View className="mt-4 flex flex-row flex-wrap items-center justify-center gap-3">
                <Link href={GOOGLE_PLAY_URL} asChild>
                  <Button size="lg" className="px-5">
                    <Text asChild>
                      <span>Get it on Google Play</span>
                    </Text>
                  </Button>
                </Link>
                <Link href={APP_STORE_URL} asChild>
                  <Button size="lg" variant="outline" className="px-5">
                    <Text asChild>
                      <span>Download on the App Store</span>
                    </Text>
                  </Button>
                </Link>
              </View>

              <View className="mt-3 flex flex-row flex-wrap items-center justify-center gap-2">
                <View className="border-border rounded-full border px-3 py-1">
                  <Text className="text-muted-foreground text-xs">
                    No ads. No tracking.
                  </Text>
                </View>
                <View className="border-border rounded-full border px-3 py-1">
                  <Text className="text-muted-foreground text-xs">
                    Offline‑first
                  </Text>
                </View>
                <View className="border-border rounded-full border px-3 py-1">
                  <Text className="text-muted-foreground text-xs">
                    Secure optional sync
                  </Text>
                </View>
              </View>

              <View className="mt-2">
                <Link href="/privacy-policy" asChild>
                  <Button variant="link" size="sm">
                    <Text asChild>
                      <span>Read our Privacy Policy</span>
                    </Text>
                  </Button>
                </Link>
              </View>
            </View>
          </View>
        </View>

        <View className="mx-auto max-w-6xl px-6 py-12">
          <View className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(feature => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="muted">{feature.description}</Text>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>

        <View className="border-border border-t">
          <View className="mx-auto max-w-5xl px-6 py-8">
            <Text variant="small" className="text-muted-foreground text-center">
              © {new Date().getFullYear()} Breadly. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
