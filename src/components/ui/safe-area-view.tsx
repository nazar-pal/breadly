import { withUniwind } from 'uniwind'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

/**
 * SafeAreaView wrapped with Uniwind to support className prop.
 * Use this instead of importing directly from react-native-safe-area-context.
 */
export const SafeAreaView = withUniwind(RNSafeAreaView)
