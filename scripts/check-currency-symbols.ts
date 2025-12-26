import { codes } from 'currency-codes'
import getSymbol from 'currency-symbol-map'

const allCodes = codes()

const codesWithoutSymbols: string[] = []
const codesWithSymbols: string[] = []

for (const code of allCodes) {
  const symbol = getSymbol(code)
  if (!symbol) {
    codesWithoutSymbols.push(code)
  } else {
    codesWithSymbols.push(code)
  }
}

console.log('=== Currency Symbol Coverage Report ===\n')
console.log(`Total currency codes: ${allCodes.length}`)
console.log(`Codes with symbols: ${codesWithSymbols.length}`)
console.log(`Codes without symbols: ${codesWithoutSymbols.length}\n`)

if (codesWithoutSymbols.length > 0) {
  console.log('Currency codes WITHOUT symbols:')
  console.log(codesWithoutSymbols.join(', '))
  console.log('\n')
}

if (codesWithSymbols.length > 0 && codesWithoutSymbols.length > 0) {
  console.log('Currency codes WITH symbols:')
  console.log(codesWithSymbols.join(', '))
}
