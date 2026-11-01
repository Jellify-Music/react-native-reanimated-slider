import type { RefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SliderOrientation } from '.';
import type { SliderValueChange, SliderValueUpdate } from './events';

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
  value: SharedValue<number>;
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
