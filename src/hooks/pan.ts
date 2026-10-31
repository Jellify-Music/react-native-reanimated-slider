import { usePanGesture } from 'react-native-gesture-handler';
import type { SliderGestureProps } from '../types/gestures';

const useSliderPanGesture = ({
  testID,
  mainAxisHitSlop,
  gestureActiveRef,
  value,
  positionFromEvent,
  handleValueChange,
}: SliderGestureProps) =>
  usePanGesture({
    runOnJS: true,
    testID: testID && `${testID}-pan`,
    hitSlop: mainAxisHitSlop,
    onActivate: (event) => {
      if (gestureActiveRef) {
        gestureActiveRef.current = true;
      }

      value.set(positionFromEvent(event));
    },
    onUpdate: (event) => {
      value.set(positionFromEvent(event));
    },
    onDeactivate: async (event) => {
      const position = positionFromEvent(event);

      value.set(position);

      await handleValueChange(position);
    },
  });

export default useSliderPanGesture;
