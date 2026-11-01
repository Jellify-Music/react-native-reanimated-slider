/* global module, require */
// Jest mock for the slider. Kept as CommonJS without JSX so consumers can load it
// without adding this package to their `transformIgnorePatterns`.
//
// jest.mock('@jellify-music/react-native-reanimated-slider', () =>
//   require('@jellify-music/react-native-reanimated-slider/mock')
// );
const { createElement } = require('react');
const { View } = require('react-native');

// Mirrors src/enums so the mock doesn't load the ESM build
const SliderOrientations = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
};

/**
 * Renders a plain `View` in place of the slider. `onValueChange` is passed
 * through, so tests can trigger it with `fireEvent(slider, 'valueChange', 42)`.
 */
function Slider({ testID, value, maxValue, onValueChange }) {
  return createElement(View, {
    testID,
    accessibilityRole: 'adjustable',
    accessibilityValue: { min: 0, max: maxValue, now: value?.value },
    onValueChange,
  });
}

module.exports = {
  __esModule: true,
  default: Slider,
  SliderOrientations,
};
