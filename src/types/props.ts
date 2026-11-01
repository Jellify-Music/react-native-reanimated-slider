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
   * Snaps the slider to multiples of this interval while it's dragged or tapped
   */
  step?: number;
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
