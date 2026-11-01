import type { RefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SliderOrientation } from '.';
import type { SliderValueChange } from './events';

/**
 * Props
 */
export interface SliderProps {
  onValueChange: SliderValueChange;
  maxValue: number;
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
