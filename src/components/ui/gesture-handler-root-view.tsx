import { withUniwind } from 'uniwind'
import { GestureHandlerRootView as RNGestureHandlerRootView } from 'react-native-gesture-handler'

/**
 * GestureHandlerRootView wrapped with Uniwind to support className prop.
 * Use this instead of importing directly from react-native-gesture-handler.
 */
export const GestureHandlerRootView = withUniwind(RNGestureHandlerRootView)
