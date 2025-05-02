import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'expo-calculator-app',
  slug: 'expo-calculator-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.expocalculatorapp'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.yourcompany.expocalculatorapp'
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'e8c296df-c443-4a97-a88d-24a139b175a7'
    },
    openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY
  },
  experiments: {
    typedRoutes: true
  }
}); 