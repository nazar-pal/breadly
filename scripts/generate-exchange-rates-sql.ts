import { codes } from 'currency-codes'

const API_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
const FALLBACK_URL =
  'https://latest.currency-api.pages.dev/v1/currencies/usd.json'

// Our ISO 4217 currencies (179 total)
const ISO_CURRENCIES = new Set(codes())

async function fetchRates(url: string): Promise<any> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

async function generateExchangeRatesSQL() {
  let data
  try {
    data = await fetchRates(API_URL)
  } catch (error) {
    console.error('Primary API failed, trying fallback...', error)
    data = await fetchRates(FALLBACK_URL)
  }

  const date = data.date
  const rates = data.usd

  // Filter to only ISO 4217 currencies and exclude USD itself
  const isoRates = Object.entries(rates)
    .filter(([code]) => {
      const upperCode = code.toUpperCase()
      return ISO_CURRENCIES.has(upperCode) && upperCode !== 'USD'
    })
    .map(([code, rate]) => {
      const upperCode = code.toUpperCase()
      return `    ('USD', '${upperCode}', ${rate}, '${date}')`
    })
    .sort((a, b) => {
      // Sort by currency code
      const codeA = a.match(/'([A-Z]{3})'/)?.[1] || ''
      const codeB = b.match(/'([A-Z]{3})'/)?.[1] || ''
      return codeA.localeCompare(codeB)
    })

  const count = isoRates.length
  const values = isoRates.join(',\n')

  const sql = `INSERT INTO exchange_rates (base_currency, quote_currency, rate, rate_date)
VALUES
${values}
ON CONFLICT (base_currency, quote_currency, rate_date) DO UPDATE SET rate = EXCLUDED.rate;`

  console.log(sql)
  console.error(`\nGenerated ${count} exchange rates for date ${date}`)
}

generateExchangeRatesSQL().catch(console.error)
