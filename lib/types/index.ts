// eslint-disable-next-line no-restricted-imports
import * as LucideIcons from 'lucide-react-native'

export type StringWithAutocompleteOptions<TOptions extends string> =
  | (string & {})
  | TOptions

/** Union of every component name that the package exports */
export type LucideIconName = keyof typeof LucideIcons

/** Read-only array of those names you can persist or iterate over */
export const LUCIDE_ICON_NAMES = Object.keys(
  LucideIcons
) as readonly LucideIconName[]
