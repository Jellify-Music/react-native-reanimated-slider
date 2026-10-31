import type { SliderOrientations } from '../enums';

export type HitSlop = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SliderOrientation =
  (typeof SliderOrientations)[keyof typeof SliderOrientations];
