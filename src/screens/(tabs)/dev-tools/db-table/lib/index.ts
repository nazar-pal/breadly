export {
  type EntityType,
  type SortOrder
} from '@/screens/(tabs)/dev-tools/db/lib'

export function escapeIdent(value?: string): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}
