export default function TrpcTestScreen() {
  if (!__DEV__) return null

  // Dynamic require ensures this code is tree-shaken in production
  const TrpcTestDev = require('@/screens/(tabs)/dev-tools/trpc-test').default
  return <TrpcTestDev />
}
