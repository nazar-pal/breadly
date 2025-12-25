import { Text } from '@/components/ui/text'
import Head from 'expo-router/head'
import React from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { PrivacySection } from './components/privacy-section'
import {
  APP_NAME,
  DEVELOPER_NAME,
  LAST_UPDATED,
  SUPPORT_EMAIL
} from './lib/consts'
import { PRIVACY_SECTIONS } from './lib/data'

export default function PrivacyPolicyScreen(): React.ReactElement {
  return (
    <>
      <Head>
        <title>{APP_NAME} – Privacy Policy</title>
        <meta
          name="description"
          content={`${APP_NAME} Privacy Policy: local-only mode, optional paid sync, and optional camera-based receipt capture using third-party AI image processing providers. No ads or third-party tracking.`}
        />
      </Head>

      <ScrollView
        className="bg-muted/20 flex-1"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mx-auto w-full max-w-4xl space-y-8 px-5 py-10">
          <View className="border-border/60 bg-card/80 rounded-3xl border p-6 shadow-sm shadow-black/5">
            <Text variant="h1" className="text-center text-balance">
              {APP_NAME} – Privacy Policy
            </Text>
            <Text variant="muted" className="mt-4 text-center text-base">
              Last updated: {LAST_UPDATED}
            </Text>
            <View className="mt-6 flex-row flex-wrap items-center justify-center gap-4">
              <Text
                variant="small"
                className="text-muted-foreground text-center"
              >
                Controller: {DEVELOPER_NAME}
              </Text>
              <Text
                variant="small"
                className="text-muted-foreground text-center"
              >
                Contact: {SUPPORT_EMAIL}
              </Text>
            </View>
          </View>

          <View className="space-y-6">
            {PRIVACY_SECTIONS.map(section => (
              <PrivacySection key={section.id} section={section} />
            ))}
          </View>

          <View className="border-border/70 border-t pt-4">
            <Text variant="small" className="text-muted-foreground text-center">
              © {new Date().getFullYear()} {DEVELOPER_NAME}.
              {Platform.OS === 'web'
                ? ' This page is accessible as a public web URL for Google Play.'
                : ''}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
