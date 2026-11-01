import { useEffect, type RefObject } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

/**
 * Resolves the slider's `value` prop to a shared value.
 *
 * Shared values are used as is. Numbers are mirrored into an internal shared
 * value, which is kept in sync with the prop unless a gesture is in progress,
 * so a frequently updated value (e.g. playback progress) doesn't yank the
 * thumb out from under the user's finger.
 */
export default function useSliderValue(
  value: SharedValue<number> | number,
  gestureActiveRef: RefObject<boolean>
): SharedValue<number> {
  const isNumber = typeof value === 'number';

  const internalValue = useSharedValue(isNumber ? value : 0);

  useEffect(() => {
    if (isNumber && !gestureActiveRef.current) {
      internalValue.set(value);
    }
  }, [isNumber, value, internalValue, gestureActiveRef]);

  return isNumber ? internalValue : value;
}
