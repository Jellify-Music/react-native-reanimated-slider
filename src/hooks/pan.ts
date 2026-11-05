import { usePanGesture } from 'react-native-gesture-handler';
import type { SliderGestureParams } from '../types/gestures';

const useSliderPanGesture = ({
  testID,
  mainAxisHitSlop,
  gestureActiveRef,
  moveTo,
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

      moveTo(positionFromEvent(event));
    },
    onUpdate: (event) => {
      const position = moveTo(positionFromEvent(event));

      onValueUpdate?.(position);
    },
    onDeactivate: async (event) => {
      const position = moveTo(positionFromEvent(event), true);

      await handleValueChange(position);
    },
  });

export default useSliderPanGesture;
