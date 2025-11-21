import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({ id: 'app-storage-v1' })

export const LocalStore = {
  getItem(key: string): string | null {
    return storage.getString(key) ?? null
  },
  setItem(key: string, value: string): void {
    storage.set(key, value)
  },
  removeItem(key: string): void {
    storage.remove(key)
  }
}
