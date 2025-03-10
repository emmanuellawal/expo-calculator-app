# Expo Calculator App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It is a simple calculator application built using React Native and TypeScript.

## Features

- **Calculator Functionality**: Perform basic arithmetic operations such as addition, subtraction, multiplication, and division.
- **Theming**: Supports light and dark modes using the `useColorScheme` hook.
- **File-based Routing**: Uses Expo Router for navigation.
- **Custom Components**: Includes custom components like `ThemedText`, `ThemedView`, `Collapsible`, and more.
- **Animations**: Utilizes `react-native-reanimated` for animations.
- **Haptic Feedback**: Provides haptic feedback on iOS using `expo-haptics`.

## Project Structure

The project has the following structure:

```
expo-calculator-app/
├── app/
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── explore.tsx
│   │   └── index.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── HapticTab.tsx
│   ├── HelloWave.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── __tests__/
│       └── ThemedText-test.tsx
├── constants/
│   └── Colors.ts
├── hooks/
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── scripts/
│   └── reset-project.js
├── .gitignore
├── app.json
├── LICENSE
├── package.json
├── README.md
└── tsconfig.json
```

## Get Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the app**:
   ```bash
   npx expo start
   ```

   In the output, you'll find options to open the app in a:
   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

3. **Run tests**:
   ```bash
   npm test
   ```

## Get a Fresh Project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## How Expo is Utilized

- **Expo Router**: The project uses Expo Router for file-based routing. See [`app/_layout.tsx`](app/_layout.tsx) and [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx).
- **Expo Fonts**: Custom fonts are loaded using `expo-font`. See [`app/_layout.tsx`](app/_layout.tsx).
- **Expo Splash Screen**: The splash screen is managed using `expo-splash-screen`. See [`app/_layout.tsx`](app/_layout.tsx).
- **Expo Haptics**: Haptic feedback is provided using `expo-haptics`. See [`components/HapticTab.tsx`](components/HapticTab.tsx).
- **Expo Web Browser**: External links are opened using `expo-web-browser`. See [`components/ExternalLink.tsx`](components/ExternalLink.tsx).
- **Expo Symbols**: Icons are managed using `expo-symbols`. See [`components/ui/IconSymbol.ios.tsx`](components/ui/IconSymbol.ios.tsx) and [`components/ui/IconSymbol.tsx`](components/ui/IconSymbol.tsx).
- **Expo Blur**: Blur effects are implemented using `expo-blur`. See [`components/ui/TabBarBackground.ios.tsx`](components/ui/TabBarBackground.ios.tsx).

## Learn More

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the Community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
