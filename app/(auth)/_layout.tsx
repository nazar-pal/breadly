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
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </View>
  );
}
