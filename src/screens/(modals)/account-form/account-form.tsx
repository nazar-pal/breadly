import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AccountFormModal } from './components/account-form-modal'

export default function AccountFormScreen() {
  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="flex-1 p-4"
    >
      <KeyboardAvoidingView
        className="flex-1 "
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <AccountFormModal />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
