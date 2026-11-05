import type { HitSlop } from './index';
import type { RefObject } from 'react';
import type { SliderValueUpdate } from './events';

export type SliderGestureParams = {
  testID?: string;
  mainAxisHitSlop: HitSlop;
  gestureActiveRef?: RefObject<boolean>;
  positionFromEvent: ({ x, y }: { x: number; y: number }) => number;
  /**
   * Moves the slider to the raw gesture position, returning the snapped value.
   * `released` settles the thumb on its step once the gesture ends.
   */
  moveTo: (position: number, released?: boolean) => number;
  /**
   * Clamps the raw gesture position and reports it via `onValueChange`.
   */
  handleValueChange: (position: number) => Promise<void>;
  /**
   * Reports the value on each update during the pan gesture.
   */
  onValueUpdate?: SliderValueUpdate;
};
