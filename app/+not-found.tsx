import { useTheme } from '@/context/ThemeContext';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          This screen doesn&apos;t exist.
        </Text>
        <Link
          href="/"
          style={[styles.link, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.linkText, { color: colors.textInverse }]}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
