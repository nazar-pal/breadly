/**
 * String type with IDE autocomplete for specific values while accepting any string.
 *
 * Uses `string & {}` trick to preserve autocomplete (unlike `"red" | "blue" | string` which collapses to `string`).
 *
 * @example
 * ```ts
 * type Color = StringWithAutocompleteOptions<"red" | "blue" | "green">
 * const color: Color = "red" // ✓ Autocomplete works
 * const custom: Color = "custom-color" // ✓ Also valid
 * ```
 */
export type StringWithAutocompleteOptions<TOptions extends string> =
  | (string & {})
  | TOptions
