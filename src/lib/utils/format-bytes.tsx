/**
 * Format bytes to human-readable string (B, KB, MB, GB).
 * Returns undefined for invalid/zero values.
 */
export function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return undefined
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let value = bytes
  while (value >= 1024 && i < units.length - 1) {
    value = value / 1024
    i++
  }
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${units[i]}`
}
