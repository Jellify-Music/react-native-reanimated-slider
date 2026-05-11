# Contributing to @jellify-music/react-native-reanimated-slider

Thanks for your interest in contributing! This guide will help you set up the development environment and run the example app.

## Prerequisites

- **Node.js** (v18+)
- **Bun** (v1.0+) - Install from [bun.sh](https://bun.sh)
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/Jellify-Music/react-native-animated-slider.git
   cd react-native-animated-slider
   ```

2. Install dependencies using Bun:
   ```sh
   bun install
   ```

## Running the Example App

### iOS

1. Navigate to the example directory:

   ```sh
   cd example
   ```

2. Generate native projects (first time only):

   ```sh
   bun prebuild
   ```

3. Start the development server:

   ```sh
   bun start
   ```

4. In a new terminal, run on iOS simulator:

   ```sh
   bun ios
   ```

   To run on a specific device:

   ```sh
   bun ios --simulator="iPhone 17"
   ```

### Android

1. Navigate to the example directory:

   ```sh
   cd example
   ```

2. Generate native projects (first time only):

   ```sh
   bun prebuild
   ```

3. Start the development server:

   ```sh
   bun start
   ```

4. In a new terminal, run on Android:
   ```sh
   bun android
   ```

## Running Tests

From the root directory, run the test suite:

```sh
# Run tests once
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## Linting and Type Checking

```sh
# Lint TypeScript files
bun lint

# Check TypeScript types
bun typecheck

# Format code (if prettier is configured)
bun format
```

## Building

To build the library for distribution:

```sh
bun prepare
```

This will generate the compiled output in the `lib/` directory.

## Troubleshooting

### iOS build fails with "module map not found"

Clean the derived data and rebuild:

```sh
rm -rf ~/Library/Developer/Xcode/DerivedData/
cd example && bun prebuild && bun ios
```

### Android build fails

Clean the Android build:

```sh
cd example/android
./gradlew clean
cd .. && bun android
```

### Dependencies not installing properly

Clear Bun's cache and reinstall:

```sh
bun install --force
```

## CI/CD

This repository has automated CI that runs on every push to `main` and on all pull requests. The CI pipeline runs:

- **Lint**: Checks code style with ESLint
- **Typecheck**: Validates TypeScript types
- **Tests**: Runs the Jest test suite with coverage
- **Build**: Builds the library for distribution

All checks must pass before merging to main.

## Code Style

- Use TypeScript for all code
- Follow the existing code structure and naming conventions
- Add tests for new functionality
- Keep pull requests focused and well-described

## Questions?

Feel free to open an issue on GitHub or reach out to the maintainers.
