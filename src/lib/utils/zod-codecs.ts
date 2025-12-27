import { z } from 'zod'
import { parseDateString, toDateString } from './date-string'

/**
 * ISO datetime string ↔ Date. Validates ISO 8601 format, preserves timezone.
 * @example isoDatetimeToDate.parse('2024-01-15T10:30:00.000Z')
 */
export const isoDatetimeToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: isoString => new Date(isoString),
  encode: date => date.toISOString()
})

/**
 * ISO date string (YYYY-MM-DD) ↔ Date. Date-only, time stripped on encode.
 * Uses LOCAL timezone to preserve calendar date (see @/lib/utils/date-string).
 * @example isoDateToDate.parse('2024-01-15')
 */
export const isoDateToDate = z.codec(z.iso.date(), z.date(), {
  decode: parseDateString,
  encode: toDateString
})

/**
 * Unix timestamp (seconds) ↔ Date. Non-negative integers only.
 * @example epochSecondsToDate.parse(1705315800)
 */
export const epochSecondsToDate = z.codec(z.int().min(0), z.date(), {
  decode: seconds => new Date(seconds * 1000),
  encode: date => Math.floor(date.getTime() / 1000)
})

/**
 * Unix timestamp (milliseconds) ↔ Date. Non-negative integers only.
 * @example epochMillisToDate.parse(1705315800000)
 */
export const epochMillisToDate = z.codec(z.int().min(0), z.date(), {
  decode: millis => new Date(millis),
  encode: date => date.getTime()
})

/**
 * String ("true"/"false") ↔ boolean. Case-sensitive enum validation.
 * @example stringToBoolean.parse('true')
 */
export const stringToBoolean = z.codec(z.enum(['true', 'false']), z.boolean(), {
  decode: str => str === 'true',
  encode: bool => (bool ? 'true' : 'false')
})

/**
 * Numeric string ↔ number. Validates regex, uses parseFloat (supports decimals).
 * @example stringToNumber.parse('123.45')
 */
export const stringToNumber = z.codec(
  z.string().regex(z.regexes.number),
  z.number(),
  {
    decode: str => Number.parseFloat(str),
    encode: num => num.toString()
  }
)

/**
 * Integer string ↔ int. Validates regex, uses parseInt (base 10, no decimals).
 * @example stringToInt.parse('123')
 */
export const stringToInt = z.codec(
  z.string().regex(z.regexes.integer),
  z.int(),
  {
    decode: str => Number.parseInt(str, 10),
    encode: num => num.toString()
  }
)

/**
 * String ↔ string | undefined. Trims input string, converts empty trimmed strings to undefined.
 * On encode, converts undefined to empty string.
 * @example trimToUndefined.parse('  hello  ') // 'hello'
 * @example trimToUndefined.parse('   ') // undefined
 */
export const trimToUndefined = z.codec(z.string(), z.string().optional(), {
  decode: str => {
    const trimmed = str.trim()
    return trimmed === '' ? undefined : trimmed
  },
  encode: str => (str === undefined ? '' : str)
})
