# React Native Animated Slider Example

This is an example project demonstrating how to use the `@jellify-music/react-native-reanimated-slider` component.

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Install iOS dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Metro Bundler

Start the Metro development server:

```bash
bun start
# or
npm start
```

### iOS

1. Open the iOS project in Xcode:
   ```bash
   open ios/example.xcworkspace
   ```
2. Select a simulator or connected device
3. Press the Run button (▶️) in Xcode

### Android

1. Open the Android project in Android Studio:
   ```bash
   open -a "Android Studio" android/
   ```
2. Wait for Gradle sync to complete
3. Select a device/emulator and run the app

## Features Demonstrated

- Basic slider usage with value binding
- Custom styling (colors, sizes)
- Value change callbacks
- Integration with React Native Reanimated
