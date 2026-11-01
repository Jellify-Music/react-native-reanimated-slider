import type { HitSlop } from './index';
import type { RefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';

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
};
