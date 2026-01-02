import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { DataLossWarning, GoogleOAuthButton } from '@/system-v2/components'
import { LinearGradient } from 'expo-linear-gradient'
import { useColorScheme, View } from 'react-native'

export function WelcomeCard() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Softer, darker gradient for dark mode to reduce eye strain
  const gradientColors: [string, string] = isDark
    ? ['#3b1d6e', '#1e1b4b'] // muted violet-900 to indigo-950
    : ['#7c3aed', '#4338ca'] // violet-600 to indigo-700

  return (
    <View className="overflow-hidden rounded-2xl shadow-lg">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16 }}
      >
        <View className="px-6 py-6">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Icon name="Wallet" size={24} className="text-white" />
          </View>

          <Text className="mb-2 text-xl font-bold text-white">
            Take control of your finances
          </Text>
          <Text className="mb-6 text-sm leading-relaxed text-white/80">
            Sign in to unlock cloud sync, access your data across devices, and
            never lose track of your spending.
          </Text>

          <GoogleOAuthButton />
          <DataLossWarning />
        </View>
      </LinearGradient>
    </View>
  )
}
