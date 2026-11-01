import type { HitSlop } from './index';
import type { RefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SliderValueUpdate } from './events';

export type SliderGestureParams = {
  testID?: string;
  mainAxisHitSlop: HitSlop;
  gestureActiveRef?: RefObject<boolean>;
  value: SharedValue<number>;
  positionFromEvent: ({ x, y }: { x: number; y: number }) => number;
  /**
   * Clamps the raw gesture position and reports it via `onValueChange`.
   */
  handleValueChange: (position: number) => Promise<void>;
  /**
   * Reports the value on each update during the pan gesture.
   */
  onValueUpdate?: SliderValueUpdate;
};
