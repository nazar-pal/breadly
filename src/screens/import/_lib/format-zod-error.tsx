import { ZodError } from 'zod'

export function formatZodError(error: ZodError): string {
  const firstIssue = error.issues[0]
  if (!firstIssue) return error.message

  const rowIndex =
    typeof firstIssue.path[0] === 'number' ? firstIssue.path[0] : null
  const field = String(
    firstIssue.path.slice(1).join('.') || firstIssue.path[0] || 'unknown'
  )
  const rowLabel = rowIndex !== null ? `Row ${rowIndex + 1}` : 'Data'

  return `${rowLabel}, "${field}": ${firstIssue.message}`
}
