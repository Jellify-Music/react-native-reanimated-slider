import type { RefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SliderOrientation } from '.';
import type {
  SliderStepAnimation,
  SliderValueChange,
  SliderValueUpdate,
} from './events';

/**
 * Props
 */
export interface SliderProps {
  onValueChange: SliderValueChange;
  /**
   * Fires with the clamped value on every update during the pan gesture
   */
  onValueUpdate?: SliderValueUpdate;
  maxValue: number;
  /**
   * Snaps the slider to multiples of this interval while it's dragged or tapped
   */
  step?: number;
  /**
   * How far the thumb follows the finger between steps, from 0 (not at all)
   * to 1 (all the way). Defaults to 0.3
   */
  stepResistance?: number;
  /**
   * Creates the animation that moves the thumb into a step once the finger
   * passes the midpoint, e.g. `(toValue) => withTiming(toValue)`.
   * Defaults to a spring
   */
  stepAnimation?: SliderStepAnimation;
  /**
   * The slider's value, as either a Reanimated shared value or a plain number.
   * A number is synced to the slider whenever it changes, except mid-gesture.
   */
  value: SharedValue<number> | number;
  thumbWidth: number;
  thumbShadowColor?: string;
  trackHeight: number;
  backgroundColor: string;
  color: string;
  gestureActiveRef?: RefObject<boolean>;
  hitSlop?: number;
  orientation?: SliderOrientation;
  testID?: string;
}
