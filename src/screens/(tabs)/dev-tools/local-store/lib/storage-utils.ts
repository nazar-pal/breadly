import { storage } from '@/lib/storage/mmkv'
import type { StorageItem } from './types'

export function getStorageItems(): StorageItem[] {
  const keys = storage.getAllKeys()
  return keys.map(key => {
    const value = storage.getString(key)
    let isJson = false
    let formattedValue = value ?? 'undefined'

    if (value) {
      try {
        const parsed = JSON.parse(value)
        formattedValue = JSON.stringify(parsed, null, 2)
        isJson = true
      } catch {
        formattedValue = value
      }
    }

    return { key, value, isJson, formattedValue }
  })
}

export function deleteStorageItem(key: string): void {
  storage.remove(key)
}

export function clearAllStorage(): void {
  storage.clearAll()
}

export function setStorageItem(key: string, value: string): void {
  storage.set(key, value)
}

export function hasStorageKey(key: string): boolean {
  return storage.contains(key)
}
