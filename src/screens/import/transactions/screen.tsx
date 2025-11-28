import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { createManyTransactions } from '@/data/client/mutations'
import { useCsvImport } from '@/lib/hooks'
import { formatBytes } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React, { useEffect, useTransition } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ZodError } from 'zod'
import { BusyIndicator, EmptyState, PreviewInfo } from '../_components'
import { formatZodError } from '../_lib'
import { PreviewList } from './components'
import { CsvArr, csvSchema } from './lib/csv-arr-schema'
import {
  createTransactionPostValidator,
  type TransactionValidationErrorType
} from './lib/validate-import-rows'

export default function ImportTransactionsScreen() {
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
    clearError,
    isPostValid,
    postValidationStatus,
    postValidationErrors
  } = useCsvImport<CsvArr, TransactionValidationErrorType>(csvSchema, {
    postValidate: createTransactionPostValidator(userId)
  })

  const isPostValidating = postValidationStatus === 'running'

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
    if (!isPostValid) return

    startTransition(async () => {
      const [error] = await createManyTransactions({
        rows: data,
        userId
      })

      if (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to import transactions'
        Alert.alert('Import Failed', message)
        return
      }

      clearData()
      router.navigate('/(tabs)/transactions')
    })
  }

  if (data && data.length > 0) {
    const bottomInset = Math.max(insets.bottom, 16)
    const floatingPadding = bottomInset + 72
    const fileSizeLabel = formatBytes(file?.size)
    const errorCount = postValidationErrors.length
    const hasErrors = errorCount > 0
    const canImport = !isPostValidating && !isPending && isPostValid

    return (
      <View className="bg-background flex-1 pt-4">
        <PreviewInfo
          fileName={file?.name}
          dataCount={data.length}
          fileSizeLabel={fileSizeLabel}
          warningsCount={warningsCount}
          onChangeFile={pickAndParse}
          onCancel={cancel}
          type="transactions"
        />

        {/* Validation error banner */}
        {hasErrors && !isPostValidating && (
          <View className="bg-destructive/10 mx-4 mt-2 rounded-md p-3">
            <Text className="text-destructive text-sm font-medium">
              {errorCount} {errorCount === 1 ? 'error' : 'errors'} found
            </Text>
            <Text className="text-destructive/80 mt-1 text-xs">
              Fix the issues below before importing. Categories must exist and
              transactions for archived categories must have dates on or before
              the archive date.
            </Text>
          </View>
        )}

        <View className="flex-1 px-4 pt-2">
          <PreviewList
            rows={data}
            bottomPadding={floatingPadding}
            validationErrors={postValidationErrors}
          />
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
            disabled={!canImport}
            variant={hasErrors ? 'destructive' : 'default'}
          >
            {isPending || isPostValidating ? (
              <ActivityIndicator size="small" color="white" />
            ) : null}
            <Text>
              {isPostValidating
                ? 'Validating...'
                : isPending
                  ? 'Importing...'
                  : hasErrors
                    ? `${errorCount} ${errorCount === 1 ? 'Error' : 'Errors'} - Fix to Import`
                    : `Import ${data.length} Transactions`}
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
        <EmptyState onPress={pickAndParse} type="transactions" />
      )}
    </View>
  )
}
