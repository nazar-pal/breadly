import { SUPPORT_EMAIL } from './consts'

export interface TextSegment {
  type: 'text' | 'email'
  content: string
}

/**
 * Parses content string and splits it into segments (text and email parts)
 * @param content - The content string to parse
 * @returns Array of text segments
 */
export function parseContent(content: string): TextSegment[] {
  if (!content.includes(SUPPORT_EMAIL)) return [{ type: 'text', content }]

  const parts = content.split(SUPPORT_EMAIL)
  const segments: TextSegment[] = []

  parts.forEach((part, index) => {
    if (part) {
      segments.push({ type: 'text', content: part })
    }
    if (index < parts.length - 1) {
      segments.push({ type: 'email', content: SUPPORT_EMAIL })
    }
  })

  return segments
}
