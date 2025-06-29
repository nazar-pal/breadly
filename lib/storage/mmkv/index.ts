import { MMKV } from 'react-native-mmkv'

// Global MMKV instance
export const storage = new MMKV()

// Synchronous convenience API (similar surface to AsyncStorage but sync)
export const Storage = {
  getItem(key: string): string | null {
    return storage.getString(key) ?? null
  },
  setItem(key: string, value: string): void {
    storage.set(key, value)
  },
  removeItem(key: string): void {
    storage.delete(key)
  }
}
