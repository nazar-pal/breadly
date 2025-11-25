import DbTableDev from '@/screens/(tabs)/dev-tools/db'

export default function DbScreen() {
  if (!__DEV__) return null
  return <DbTableDev />
}
