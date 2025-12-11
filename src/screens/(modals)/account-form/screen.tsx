import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view'
import { View } from 'react-native'
import { AccountForm } from './components/account-form'

export default function AccountFormScreen() {
  return (
    <View className="pb-safe-or-4 flex-1 p-4">
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <AccountForm />
      </KeyboardAvoidingView>
    </View>
  )
}
