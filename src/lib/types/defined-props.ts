/**
 * **DefinedProps<T>**
 *
 * Removes all `undefined` values and properties that become `never` from a type.
 *
 * - Applies `Exclude<T[K], undefined>` to every property value.
 * - Drops properties whose resulting type becomes `never`.
 * - Uses the `-?` modifier to make all remaining properties **required**, even if they were originally optional.
 *
 * ### Example
 * ```ts
 * type Example = {
 *   a?: string | undefined
 *   b: number | undefined
 *   c?: undefined
 * }
 *
 * type Cleaned = DefinedProps<Example>
 * // Result:
 * // {
 * //   a: string
 * //   b: number
 * // }
 * ```
 *
 * ✅ Removes `undefined`
 * ✅ Removes meaningless keys (`never`)
 * ✅ Converts all surviving keys to required
 */
export type DefinedProps<T> = {
  [K in keyof T as Exclude<T[K], undefined> extends never
    ? never
    : K]-?: Exclude<T[K], undefined>
}
