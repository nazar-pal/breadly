export default function DbScreen() {
  if (!__DEV__) return null

  // Dynamic require ensures this code is tree-shaken in production
  const DbDev = require('@/screens/(tabs)/dev-tools/db').default
  return <DbDev />
}
