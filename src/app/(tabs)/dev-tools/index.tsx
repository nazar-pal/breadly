export default function LocalStoreScreen() {
  if (!__DEV__) return null

  // Dynamic require ensures this code is tree-shaken in production
  const LocalStoreDev =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@/screens/(tabs)/dev-tools/local-store').default
  return <LocalStoreDev />
}
