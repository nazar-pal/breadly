import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { colors } = useTheme();

  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </View>
  );
}
