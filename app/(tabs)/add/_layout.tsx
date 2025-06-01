// app/(tabs)/add/_layout.tsx
import { Slot } from 'expo-router';

export default function AddLayout() {
  return <Slot />;          // no Stack, no Tabs – just pass children through
}
