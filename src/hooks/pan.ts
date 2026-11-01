import { usePanGesture } from 'react-native-gesture-handler';
import type { SliderGestureParams } from '../types/gestures';

const useSliderPanGesture = ({
  testID,
  mainAxisHitSlop,
  gestureActiveRef,
  value,
  positionFromEvent,
  handleValueChange,
  onValueUpdate,
}: SliderGestureParams) =>
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
      const position = positionFromEvent(event);

      value.set(position);

      onValueUpdate?.(position);
    },
    onDeactivate: async (event) => {
      const position = positionFromEvent(event);

      value.set(position);

      await handleValueChange(position);
    },
  });

export default useSliderPanGesture;
