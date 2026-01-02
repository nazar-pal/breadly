import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { createManyCategories } from '@/data/client/mutations'
import { useCsvImport } from '@/lib/hooks'
import { formatBytes } from '@/lib/utils'
import { useUserSession } from '@/system-v2/session'
import { router } from 'expo-router'
import React, { useEffect, useTransition } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ZodError } from 'zod'
import { BusyIndicator, EmptyState, PreviewInfo } from '../_components'
import { formatZodError } from '../_lib'
import { PreviewList } from './components'
import { CsvArr, csvSchema } from './lib/csv-arr-schema'

export default function ImportCategoriesScreen() {
  const [isPending, startTransition] = useTransition()
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()
  const {
    pickAndParse,
    cancel,
    status,
    progress,
    data,
    clearData,
    warningsCount,
    file,
    error,
    clearError
  } = useCsvImport<CsvArr>(csvSchema)

  useEffect(() => {
    if (error) {
      const message =
        error instanceof ZodError ? formatZodError(error) : error.message
      Alert.alert('Import Error', message)
      clearError()
    }
  }, [error, clearError])

  const handleImport = () => {
    if (!data || data.length === 0) return

    startTransition(async () => {
      const [error] = await createManyCategories({
        rows: data,
        userId
      })

      if (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to import categories'
        Alert.alert('Import Failed', message)
        return
      }

      clearData()
      router.navigate('/')
    })
  }

  if (data && data.length > 0) {
    const bottomInset = Math.max(insets.bottom, 16)
    const floatingPadding = bottomInset + 72
    const fileSizeLabel = formatBytes(file?.size)

    return (
      <View className="bg-background flex-1 pt-4">
        <PreviewInfo
          fileName={file?.name}
          dataCount={data.length}
          fileSizeLabel={fileSizeLabel}
          warningsCount={warningsCount}
          onChangeFile={pickAndParse}
          onCancel={cancel}
          type="categories"
        />

        <View className="flex-1 px-4 pt-2">
          <PreviewList rows={data} bottomPadding={floatingPadding} />
        </View>

        <View
          pointerEvents="box-none"
          className="absolute right-4 left-4"
          style={{
            bottom: bottomInset
          }}
        >
          <Button
            onPress={handleImport}
            className="shadow-lg"
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : null}
            <Text>
              {isPending ? 'Importing...' : `Import ${data.length} Categories`}
            </Text>
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {status !== 'idle' ? (
        <BusyIndicator
          status={status}
          progress={progress}
          fileName={file?.name}
          onCancel={cancel}
        />
      ) : (
        <EmptyState onPress={pickAndParse} type="categories" />
      )}
    </View>
  )
}
