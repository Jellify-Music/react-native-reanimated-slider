import type { HitSlop } from './index';
import type { SharedValue } from 'react-native-reanimated';

export type SliderGestureProps = {
  testID?: string;
  mainAxisHitSlop: HitSlop;
  gestureActiveRef?: React.RefObject<boolean>;
  value: SharedValue<number>;
  positionFromEvent: ({ x, y }: { x: number; y: number }) => number;
  handleValueChange: (position: number) => Promise<void>;
};
