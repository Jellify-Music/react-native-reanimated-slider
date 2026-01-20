# @jellify-music/react-native-reanimated-slider

A performant, customizable slider component for React Native, powered by React Native Gesture Handler and Reanimated.

## Installation

```sh
npm install @jellify-music/react-native-reanimated-slider
# or
yarn add @jellify-music/react-native-reanimated-slider
# or
bun add @jellify-music/react-native-reanimated-slider
```

### Peer Dependencies

This library requires the following peer dependencies:

- `react-native-reanimated` >= 3.0.0
- `react-native-gesture-handler` >= 2.0.0

## Usage

```tsx
import Slider from '@jellify-music/react-native-reanimated-slider';
import { useSharedValue } from 'react-native-reanimated';

function MyComponent() {
  const progress = useSharedValue(0);

  return (
    <Slider
      value={progress}
      onValueChange={(value) => {
        console.log('Slider value:', value);
      }}
      maxValue={100}
      thumbWidth={24}
      trackHeight={8}
      backgroundColor="#e0e0e0"
      color="#6200ee"
      thumbShadowColor="#000"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `SharedValue<number>` | ✓ | A Reanimated shared value that controls the slider position |
| `onValueChange` | `(value: number) => void` | ✓ | Callback fired when the user releases the slider |
| `maxValue` | `number` | ✓ | The maximum value of the slider |
| `thumbWidth` | `number` | ✓ | The width and height of the thumb (circular) |
| `trackHeight` | `number` | ✓ | The height of the track |
| `backgroundColor` | `string` | ✓ | The color of the background track |
| `color` | `string` | ✓ | The color of the progress track and thumb |
| `thumbShadowColor` | `string` | | The shadow color of the thumb |
| `gestureActiveRef` | `RefObject<boolean>` | | A `ref` indicating whether the slider is being used |
| `hitSlop` | `object` | | A [`hitSlop`](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/native-gesture/#hitslopsettings) object |

## Features

- Smooth gesture handling with tap and pan support
- Powered by Reanimated for 60fps animations
- Fully customizable colors
- Works on iOS and Android

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
