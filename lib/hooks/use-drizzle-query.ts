import { db as drizzleDb } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import type { AdditionalOptions } from '@powersync/react-native'
import { useQuery } from '@powersync/react-native'
import type {
  DifferentialHookOptions,
  QueryResult,
  ReadonlyQueryResult
} from '@powersync/react/lib/hooks/watched/watch-types'
import type { Query } from 'drizzle-orm'

/**
 * useDrizzleQuery — ergonomic Drizzle + PowerSync hook
 *
 * Why: PowerSync's `useQuery` accepts either a SQL string or a CompilableQuery. Drizzle
 * query builders produce an object with `execute()` and `toSQL()` — which needs to be
 * wrapped with `toCompilableQuery` before passing to `useQuery`.
 *
 * This helper centralizes that conversion while preserving full static typing for
 * your Drizzle row type. It mirrors `useQuery`'s overloads, so you get the same return
 * types you expect depending on the options you pass. The first parameter can be either
 * a Drizzle query object or a factory function `(db) => drizzleQuery`.
 *
 * ----------------------------------------------------------------------------
 * Before (without this hook)
 * ----------------------------------------------------------------------------
 *
 * ```ts
 * import { toCompilableQuery } from '@powersync/drizzle-driver'
 * import { useQuery } from '@powersync/react-native'
 * import { db } from '@/system/powersync/system'
 * import { accounts } from '@/data/client/db-schema'
 * import { eq } from 'drizzle-orm'
 *
 * const query = db.query.accounts.findMany({ where: eq(accounts.userId, userId) })
 * const { data, isLoading } = useQuery(toCompilableQuery(query))
 * ```
 *
 * ----------------------------------------------------------------------------
 * After (with this hook)
 * ----------------------------------------------------------------------------
 *
 * ```ts
 * import { useDrizzleQuery } from '@/lib/hooks'
 * import { db } from '@/system/powersync/system'
 * import { accounts } from '@/data/client/db-schema'
 * import { eq } from 'drizzle-orm'
 *
 * const query = db.query.accounts.findMany({ where: eq(accounts.userId, userId) })
 * const { data, isLoading } = useDrizzleQuery(query)
 * ```
 *
 * ----------------------------------------------------------------------------
 * Alternative: Pass a factory function
 * ----------------------------------------------------------------------------
 *
 * Useful when you prefer to avoid assembling the query inline:
 *
 * ```ts
 * const { data } = useDrizzleQuery((db) =>
 *   db.query.accounts.findMany({ where: eq(accounts.userId, userId) })
 * )
 * ```
 *
 * Differential + factory example:
 *
 * ```ts
 * const { data } = useDrizzleQuery(
 *   (db) => db.query.categories.findMany({ where: eq(categories.userId, userId) }),
 *   {
 *     rowComparator: {
 *       keyBy: (row) => row.id,
 *       compareBy: (row) => JSON.stringify(row)
 *     }
 *   }
 * ) // data: readonly Readonly<RowType>[]
 * ```
 *
 * ----------------------------------------------------------------------------
 * Differential vs non-differential usage
 * ----------------------------------------------------------------------------
 *
 * - Non-differential (default): Returns a mutable `QueryResult<RowType>` with `RowType[]`.
 *
 * ```ts
 * const { data } = useDrizzleQuery(query) // data: RowType[]
 * ```
 *
 * - Differential (with `rowComparator`): Returns a `ReadonlyQueryResult<RowType>` where
 *   the array and row objects are read-only, and stable references are preserved across
 *   emissions for unchanged rows.
 *
 * ```ts
 * const { data } = useDrizzleQuery(query, {
 *   rowComparator: {
 *     keyBy: (row) => row.id,
 *     compareBy: (row) => JSON.stringify(row)
 *   }
 * }) // data: readonly Readonly<RowType>[]
 * ```
 *
 * ----------------------------------------------------------------------------
 * Why there appear to be multiple "exports"
 * ----------------------------------------------------------------------------
 *
 * You will see this function declared multiple times below. This is a TypeScript
 * overload pattern:
 *
 * - Non-differential with a Drizzle query → returns `QueryResult<RowType>`
 * - Non-differential with a factory `(db) => query` → returns `QueryResult<RowType>`
 * - Differential with a Drizzle query → returns `ReadonlyQueryResult<RowType>`
 * - Differential with a factory `(db) => query` → returns `ReadonlyQueryResult<RowType>`
 * - And then a single implementation that calls `useQuery` exactly once
 *
 * Only the third is emitted at runtime; the first two are type-only and exist to
 * give you precise return types at compile-time.
 */
type DrizzleCompilable<RowType> = {
  execute: () => Promise<RowType | RowType[]>
  toSQL: () => Query
}

type DbInstance = typeof drizzleDb

export function useDrizzleQuery<RowType>(
  query: DrizzleCompilable<RowType>,
  options?: AdditionalOptions
): QueryResult<RowType>

export function useDrizzleQuery<RowType>(
  factory: (db: DbInstance) => DrizzleCompilable<RowType>,
  options?: AdditionalOptions
): QueryResult<RowType>

export function useDrizzleQuery<RowType>(
  query: DrizzleCompilable<RowType>,
  options?: DifferentialHookOptions<RowType>
): ReadonlyQueryResult<RowType>

export function useDrizzleQuery<RowType>(
  factory: (db: DbInstance) => DrizzleCompilable<RowType>,
  options?: DifferentialHookOptions<RowType>
): ReadonlyQueryResult<RowType>

export function useDrizzleQuery<RowType>(
  queryOrFactory:
    | DrizzleCompilable<RowType>
    | ((db: DbInstance) => DrizzleCompilable<RowType>),
  options?: AdditionalOptions | DifferentialHookOptions<RowType>
): QueryResult<RowType> | ReadonlyQueryResult<RowType> {
  const resolvedQuery: DrizzleCompilable<RowType> =
    typeof queryOrFactory === 'function'
      ? queryOrFactory(drizzleDb)
      : queryOrFactory

  return useQuery<RowType>(toCompilableQuery(resolvedQuery), [], options)
}
