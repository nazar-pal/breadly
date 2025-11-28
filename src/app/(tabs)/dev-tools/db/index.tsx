export default function DbScreen() {
  if (!__DEV__) return null

  // Dynamic require ensures this code is tree-shaken in production
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DbDev = require('@/screens/(tabs)/dev-tools/db').default
  return <DbDev />
}
