import type { ConfigContext, ExpoConfig } from 'expo/config'

const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'

const getUniqueIdentifier = () => {
  if (IS_DEV) return 'com.devnazar.breadly.dev'
  if (IS_PREVIEW) return 'com.devnazar.breadly.preview'
  return 'com.devnazar.breadly'
}

const getAppName = () => {
  if (IS_DEV) return 'Breadly (Dev)'
  if (IS_PREVIEW) return 'Breadly (Preview)'
  return 'Breadly: Expense Tracker'
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: 'breadly-expense-tracker',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        'Breadly uses the camera to scan receipts so expenses can be captured quickly and accurately.',
      NSMicrophoneUsageDescription:
        'Breadly uses the microphone to capture your voice inputs for adding transactions.'
    },
    icon: {
      dark: './assets/icons/ios-dark.png',
      light: './assets/icons/ios-light.png',
      tinted: './assets/icons/ios-tinted.png'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      monochromeImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    predictiveBackGestureEnabled: true,
    package: getUniqueIdentifier()
  },
  web: {
    bundler: 'metro',
    output: 'server',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/icons/splash-icon-dark.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/icons/splash-icon-light.png',
          backgroundColor: '#000000'
        }
      }
    ],
    'expo-font',
    'expo-web-browser',
    'expo-secure-store'
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  },
  extra: {
    router: {},
    eas: {
      projectId: '36c0d713-fd76-42c0-99ba-9cbef6a99863'
    }
  },
  updates: {
    url: 'https://u.expo.dev/36c0d713-fd76-42c0-99ba-9cbef6a99863'
  },
  runtimeVersion: {
    policy: 'appVersion'
  },
  owner: 'devnazar'
})
