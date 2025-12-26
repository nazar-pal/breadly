import { codes } from 'currency-codes'

const allCodes = codes()

const values = allCodes.map(code => `('${code}')`).join(',\n  ')

const sql = `INSERT INTO currencies (code) VALUES
  ${values}
ON CONFLICT (code) DO NOTHING;`

console.log(sql)
