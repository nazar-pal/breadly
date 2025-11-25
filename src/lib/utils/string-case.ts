/**
 * Lightweight string case conversion helpers for common formats.
 *
 * Input may be camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE,
 * space-separated or mixed. Unicode letters and digits are supported.
 */

export type StringCaseStyle =
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'title'

/**
 * Normalize a string into an array of lowercase "words".
 *
 * - Handles acronyms: "URLValue" -> ["url", "value"], "HTTPRequestError" -> ["http", "request", "error"]
 * - Handles camelCase / PascalCase boundaries
 * - Treats any non-letter/digit as a separator
 * - Works with Unicode letters/digits (Cyrillic, accents, etc.)
 */
function splitIntoWords(input: string): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  return (
    trimmed
      .normalize('NFKC')
      // HTTPServer -> HTTP Server, URLValue -> URL Value
      .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, '$1 $2')
      // fooBar / foo2Bar -> foo Bar
      .replace(/([\p{Ll}\p{Nd}])(\p{Lu})/gu, '$1 $2')
      // Everything that is not a letter or digit becomes a separator
      .replace(/[^\p{L}\p{Nd}]+/gu, ' ')
      .trim()
      .toLowerCase()
      .split(/\s+/u)
  )
}

function capitalize(word: string): string {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const StringCase = {
  /**
   * camelCase
   * "hello world" → "helloWorld"
   */
  camel(input: string): string {
    const words = splitIntoWords(input)
    if (words.length === 0) return ''
    return words[0] + words.slice(1).map(capitalize).join('')
  },

  /**
   * PascalCase
   * "hello world" → "HelloWorld"
   */
  pascal(input: string): string {
    const words = splitIntoWords(input)
    return words.map(capitalize).join('')
  },

  /**
   * snake_case
   * "hello world" → "hello_world"
   */
  snake(input: string): string {
    const words = splitIntoWords(input)
    return words.join('_')
  },

  /**
   * kebab-case
   * "hello world" → "hello-world"
   */
  kebab(input: string): string {
    const words = splitIntoWords(input)
    return words.join('-')
  },

  /**
   * CONSTANT_CASE
   * "hello world" → "HELLO_WORLD"
   */
  constant(input: string): string {
    const words = splitIntoWords(input)
    return words.join('_').toUpperCase()
  },

  /**
   * Title Case
   * "hello world" → "Hello World"
   */
  title(input: string): string {
    const words = splitIntoWords(input)
    return words.map(capitalize).join(' ')
  }
} as const

export type StringCaseApi = typeof StringCase
