import { KeyboardAvoidingView as RNKeyboardAvoidingView } from 'react-native-keyboard-controller'
import { withUniwind } from 'uniwind'

/**
 * KeyboardAvoidingView wrapped with Uniwind to support className prop.
 * Use this instead of importing directly from react-native-keyboard-controller.
 */
export const KeyboardAvoidingView = withUniwind(RNKeyboardAvoidingView)
