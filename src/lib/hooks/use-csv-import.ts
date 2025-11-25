import * as DocumentPicker from 'expo-document-picker'
import Papa from 'papaparse'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'

type ImportStatus =
  | 'idle'
  | 'reading'
  | 'parsing'
  | 'validating'
  | 'post-validating'

type CsvFileMeta = {
  name?: string
  size?: number
  mimeType?: string
  uri?: string
  rowCount?: number
}

/**
 * Generic row-level validation error from post-validation
 */
export type RowValidationError<TType extends string = string> = {
  rowIndex: number
  type: TType
  message: string
}

/**
 * Result from post-validation function
 */
export type PostValidationResult<TType extends string = string> = {
  errors: RowValidationError<TType>[]
  isValid: boolean
}

/**
 * Post-validation function type.
 * Called after Zod schema validation passes.
 * Should return validation result with row-level errors.
 */
export type PostValidateFn<T, TType extends string = string> = (
  data: T
) => Promise<PostValidationResult<TType>> | PostValidationResult<TType>

type UseCsvImportOptions<T, TType extends string = string> = {
  /**
   * Optional function to perform additional validation after schema validation.
   * Useful for async validations like checking database constraints.
   */
  postValidate?: PostValidateFn<T, TType>
}

type PostValidationStatus = 'idle' | 'running' | 'completed' | 'error'

export function useCsvImport<T, TType extends string = string>(
  schema: z.ZodType<T>,
  options?: UseCsvImportOptions<T, TType>
) {
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<Error | z.ZodError | null>(null)
  const [data, setData] = useState<T | null>(null)
  const [warningsCount, setWarningsCount] = useState(0)
  const [file, setFile] = useState<CsvFileMeta | null>(null)
  const [postValidationResult, setPostValidationResult] =
    useState<PostValidationResult<TType> | null>(null)
  const [postValidationStatus, setPostValidationStatus] =
    useState<PostValidationStatus>('idle')
  const operationIdRef = useRef(0)
  const activeTaskIdRef = useRef<number | null>(null)
  const parserRef = useRef<Papa.Parser | null>(null)
  const readerRef = useRef<AbortController | null>(null)
  const postValidateRef = useRef(options?.postValidate)

  // Keep postValidate ref updated
  useEffect(() => {
    postValidateRef.current = options?.postValidate
  }, [options?.postValidate])

  function beginTask(meta?: CsvFileMeta | null) {
    const id = ++operationIdRef.current
    activeTaskIdRef.current = id
    parserRef.current = null
    readerRef.current = null
    setError(null)
    setProgress(null)
    setWarningsCount(0)
    setData(null)
    setFile(meta ?? null)
    setPostValidationResult(null)
    setPostValidationStatus('idle')
    return id
  }

  function finishTask(taskId?: number) {
    if (taskId == null || activeTaskIdRef.current === taskId) {
      activeTaskIdRef.current = null
      parserRef.current = null
      readerRef.current = null
    }
  }

  function cancel() {
    if (activeTaskIdRef.current != null) {
      readerRef.current?.abort()
      parserRef.current?.abort()
      readerRef.current = null
      parserRef.current = null
      activeTaskIdRef.current = null
      operationIdRef.current++
    }
    setStatus('idle')
    setProgress(null)
    setWarningsCount(0)
    setFile(null)
    setData(null)
    setPostValidationResult(null)
    setPostValidationStatus('idle')
  }

  useEffect(() => {
    return () => {
      const nextOpId = operationIdRef.current + 1
      operationIdRef.current = nextOpId
      if (readerRef.current || parserRef.current) {
        readerRef.current?.abort()
        parserRef.current?.abort()
        readerRef.current = null
        parserRef.current = null
      }
      activeTaskIdRef.current = null
    }
  }, [])

  async function handleParseCompletion(
    taskId: number,
    rawRows: unknown[],
    warnings: number
  ) {
    if (taskId !== operationIdRef.current) {
      finishTask(taskId)
      return
    }

    setStatus('validating')
    setProgress(null)

    try {
      const result = await schema.safeParseAsync(rawRows)
      if (taskId !== operationIdRef.current) {
        return
      }

      setWarningsCount(warnings)
      if (result.success) {
        const validatedData = result.data
        setData(validatedData)

        const rowCount = Array.isArray(validatedData)
          ? (validatedData as unknown[]).length
          : undefined
        if (rowCount != null) {
          setFile(prev => ({ ...(prev ?? {}), rowCount }))
        }

        // Run post-validation if provided
        const postValidateFn = postValidateRef.current
        if (postValidateFn) {
          if (taskId !== operationIdRef.current) return

          setStatus('post-validating')
          setPostValidationStatus('running')
          try {
            const postResult = await postValidateFn(validatedData)
            if (taskId !== operationIdRef.current) return
            setPostValidationResult(postResult)
            setPostValidationStatus('completed')
          } catch (postErr) {
            if (taskId !== operationIdRef.current) return
            console.error('Post-validation error:', postErr)
            // Mark as error - the mutation will catch actual issues
            setPostValidationResult({ errors: [], isValid: false })
            setPostValidationStatus('error')
          }
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      if (taskId === operationIdRef.current) {
        setError(
          err instanceof Error ? err : new Error('Failed to validate file')
        )
      }
    } finally {
      if (taskId === operationIdRef.current) {
        setStatus('idle')
        setProgress(null)
      }
      finishTask(taskId)
    }
  }

  function runParser(taskId: number, csvText: string) {
    const normalized = csvText.replace(/^\uFEFF/, '')
    const textLength = normalized.length

    setStatus('parsing')
    setProgress(0)

    const rawRows: unknown[] = []
    let warnings = 0
    let lastProgressValue = 0
    let lastProgressTs = 0

    Papa.parse<Record<string, unknown>>(normalized, {
      header: true as const,
      skipEmptyLines: 'greedy' as const,
      transformHeader(header) {
        return typeof header === 'string' ? header.trim() : header
      },
      transform(value: string) {
        const trimmed = typeof value === 'string' ? value.trim() : value
        return trimmed === '' ? undefined : trimmed
      },
      step(results, parser) {
        if (activeTaskIdRef.current === taskId && parserRef.current === null) {
          parserRef.current = parser
        }
        rawRows.push(results.data)
        if (Array.isArray(results.errors) && results.errors.length > 0) {
          warnings += results.errors.length
        }
        if (textLength > 0 && typeof results.meta.cursor === 'number') {
          const next = Math.min(1, results.meta.cursor / textLength)
          const now = Date.now()
          if (
            next === 1 ||
            next - lastProgressValue >= 0.01 ||
            now - lastProgressTs >= 120
          ) {
            lastProgressValue = next
            lastProgressTs = now
            setProgress(next)
          }
        }
      },
      complete() {
        void handleParseCompletion(taskId, rawRows, warnings)
      },
      error(err: Error) {
        if (taskId !== operationIdRef.current) {
          finishTask(taskId)
          return
        }
        setError(err instanceof Error ? err : new Error('Failed to parse file'))
        setWarningsCount(warnings)
        setStatus('idle')
        setProgress(null)
        finishTask(taskId)
      }
    })
  }

  async function parseFromUri(
    uri: string,
    meta?: Omit<CsvFileMeta, 'uri'>
  ): Promise<void> {
    if (status !== 'idle' || activeTaskIdRef.current !== null) return
    const taskMeta: CsvFileMeta = { ...(meta ?? {}), uri }
    const taskId = beginTask(taskMeta)
    setStatus('reading')

    const controller = new AbortController()
    if (activeTaskIdRef.current === taskId) {
      readerRef.current = controller
    }

    try {
      const response = await fetch(uri, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Failed to read file (status ${response.status})`)
      }
      const text = await response.text()

      if (taskId !== operationIdRef.current) {
        finishTask(taskId)
        return
      }

      runParser(taskId, text)
    } catch (err) {
      if ((err as Error | undefined)?.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err : new Error('Failed to read file'))
      setStatus('idle')
      setProgress(null)
      finishTask(taskId)
    }
  }

  async function pickAndParse() {
    if (status !== 'idle' || activeTaskIdRef.current !== null) return
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv'],
        copyToCacheDirectory: true
      })
      if (result.canceled) return

      const asset = result.assets?.[0]
      if (!asset?.uri) {
        setError(new Error('No file selected'))
        return
      }
      return parseFromUri(asset.uri, {
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to pick file'))
    }
  }

  function clearError() {
    setError(null)
  }

  function clearData() {
    setData(null)
  }

  // Derived values for convenience
  const hasPostValidation = !!options?.postValidate
  const isPostValid = hasPostValidation
    ? postValidationStatus === 'completed' &&
      postValidationResult?.isValid === true
    : true

  return {
    status,
    progress,
    pickAndParse,
    cancel,
    error,
    warningsCount,
    file,
    clearError,
    data,
    clearData,
    /** Post-validation result (null if no post-validate fn or not yet run) */
    postValidationResult,
    /** Status of post-validation: 'idle' | 'running' | 'completed' | 'error' */
    postValidationStatus,
    /** Whether a post-validation function was provided */
    hasPostValidation,
    /** True if post-validation passed, or no post-validation was provided */
    isPostValid,
    /** Post-validation errors array (empty if none) */
    postValidationErrors: postValidationResult?.errors ?? []
  }
}
