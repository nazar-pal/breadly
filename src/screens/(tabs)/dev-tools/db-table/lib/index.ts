export * from './types'

export function escapeIdent(value?: string): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}
